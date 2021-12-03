import * as csv from "fast-csv";
import { QueryResult } from "pg";
import pgFormat from "pg-format";
import bcrypt from "bcrypt";
import camelcaseKeys from "camelcase-keys";
import Joi from "joi";
import {
  accountValidater,
  companyValidater,
  companyMemberValidater,
  addressValidater,
  ownersValidater
} from "./valdiation";

// function to clean input data.
function cleanInput(record) {
  for (const property in record) {
    // eslint-disable-next-line
    record[property] = record[property].replace(/'/g, "''"); // replace any single apostrophes with repeated apostrophes to make Postgres happy
  }
  return record;
}

export const singleImport = async (file) =>
  new Promise<any[]>((resolve, reject) => {
    const result = [];
    const { createReadStream } = file;

    const stream = createReadStream();

    stream
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        result.push(row);
      })
      .on("end", () => {
        return resolve(result);
      });
  });

export const getTree = (companies, accounts, addresses, owners, members) =>
  companies.map((company) => {
    const accountMap = accounts.reduce(
      (result, current) => ({
        ...result,
        [current.migration_id]: current
      }),
      {}
    );
    const adressMap = addresses.reduce((result, current) => {
      let coordinates = null;

      if (current.coordinates) {
        const [x, y] = current.coordinates.split(",");
        coordinates = {
          x: parseFloat(x),
          y: parseFloat(y)
        };
      }

      return {
        ...result,
        [current.migration_id]: {
          ...current,
          ...(coordinates?.y &&
            coordinates?.x && {
              coordinates: `(${parseFloat(coordinates.x)},${parseFloat(
                coordinates.y
              )})`
            })
        }
      };
    }, {});
    const ownersMap = owners.reduce(
      (result, current) => ({
        ...result,
        [current.migration_id]: current
      }),
      {}
    );

    return camelcaseKeys({
      ...company,
      ...ownersMap[company.migration_id],
      "@registeredAddress": camelcaseKeys(
        adressMap[`${company.registered_address_migration_id}`]
      ),
      "@tradingAddress": camelcaseKeys(
        adressMap[`${company.trading_address_migration_id}`]
      ),
      "@companyMembers": {
        data: members
          .filter(
            ({ company_migration_id }) =>
              company_migration_id === company.migration_id
          )
          .map(({ account_migration_id }) => ({
            "@account": accountMap[`${account_migration_id}`]
          }))
          .map((item) => ({
            "@nodes": camelcaseKeys(item)
          }))
      }
    });
  });

export const importAccountsCompaniesFromCVS = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgRootPool, user } = context;
  const logger = context.logger("import:account");
  const { input } = args;

  if (!user.can("import:account:markets")) {
    throw new Error("unauthorized");
  }

  const files = await input.files;

  let companiesQuery = null;
  let membersQuery = null;
  let ownersQuery = null;
  let addressQuery = null;
  let addressCompaniesQuery = null;
  let accountsQuery = null;

  let companies = [];
  let accounts = [];
  let addresses = [];
  let owners = [];
  let members = [];

  let marketDomain = null;
  for await (let file of files) {
    const { filename, ...f } = await file;

    const parsedFile: any[] = await singleImport({ filename, ...f });

    const [market, type] = filename.split("-");

    if (marketDomain && market !== marketDomain) {
      throw new Error("market_mismatch");
    }

    marketDomain = market;

    if (type === "companies.csv") {
      companies = parsedFile;
      await Joi.array().items(companyValidater).validateAsync(companies);
    } else if (type === "addresses.csv") {
      addresses = parsedFile;
      await Joi.array().items(addressValidater).validateAsync(addresses);
    } else if (type === "owners.csv") {
      owners = parsedFile;
      await Joi.array().items(ownersValidater).validateAsync(owners);
    } else if (type === "members.csv") {
      members = parsedFile;
      await Joi.array().items(companyMemberValidater).validateAsync(members);
    } else if (type === "accounts.csv") {
      accounts = parsedFile.map((account) => ({
        ...account,
        email: account.email.toLowerCase()
      }));
      await Joi.array().items(accountValidater).validateAsync(accounts);
    }
  }

  if (args.input.dryRun) {
    if (companies.length > 0) {
      const companiesTree = getTree(
        companies,
        accounts,
        addresses,
        owners,
        members
      ).map((item) => camelcaseKeys(item));

      const result = {
        dryRun: args.input.dryRun,
        companies: companiesTree,
        accounts: accounts.map((item) => camelcaseKeys(item))
      };

      return result;
    }

    if (accounts.length > 0) {
      const result = {
        dryRun: args.input.dryRun,
        accounts: accounts.map((item) => camelcaseKeys(item))
      };

      return result;
    }
  }

  if (!marketDomain) {
    throw new Error("market_missing");
  }

  const { rows } = await pgRootPool.query(
    "SELECT id FROM market WHERE domain = $1",
    [marketDomain]
  );

  const marketId = rows[0].id;

  if (accounts.length)
    accountsQuery = pgFormat(
      "INSERT INTO account(market_id, status, role, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, migration_id) VALUES %L RETURNING *",
      accounts.map((account) => [
        account.role === "SUPER_ADMIN" ? null : parseInt(marketId),
        account.status,
        account.role,
        account.email,
        account.phone,
        account.first_name,
        account.last_name,
        account.created,
        account.docebo_user_id,
        account.docebo_username,
        account.migration_id
      ])
    );

  if (companies.length)
    companiesQuery = pgFormat(
      "INSERT INTO company(market_id, migration_id, business_type, name, tier, status, tax_number, about_us, logo, phone, public_email, registered_address_migration_id, trading_address_migration_id, website, linked_in) VALUES %L RETURNING *",
      companies.map((company) => [
        parseInt(marketId),
        company.migration_id,
        company.business_type,
        company.name,
        company.tier,
        company.status,
        company.tax_number,
        company.about_us,
        company.logo,
        company.phone,
        company.public_email,
        company?.registered_address_migration_id?.toLowerCase() === "empty"
          ? null
          : company.registered_address_migration_id,
        company?.trading_address_migration_id?.toLowerCase() === "empty"
          ? null
          : company.trading_address_migration_id,
        company.website,
        company.linked_in
      ])
    );

  if (addresses.length)
    addressQuery = pgFormat(
      "INSERT INTO address(migration_id, first_line, second_line, town, country, postcode, coordinates) VALUES %L RETURNING *",
      addresses.map((address) => [
        address.migration_id,
        address.first_line,
        address.second_line,
        address.town,
        address.country,
        address.postcode,
        address.coordinates || null
      ])
    );

  addressCompaniesQuery = "";
  companies.forEach((company) => {
    if (
      company?.registered_address_migration_id &&
      company?.registered_address_migration_id?.toLowerCase() !== "empty"
    )
      addressCompaniesQuery += pgFormat(
        `UPDATE company SET registered_address_id = (SELECT id FROM address WHERE migration_id = %L) WHERE id = (SELECT id FROM company WHERE migration_id = %L);`,
        company.registered_address_migration_id,
        company.migration_id
      );
    if (
      company.trading_address_migration_id &&
      company.trading_address_migration_id?.toLowerCase() !== "empty"
    )
      addressCompaniesQuery += pgFormat(
        `UPDATE company SET trading_address_id = (SELECT id FROM address WHERE migration_id = %L) WHERE id = (SELECT id FROM company WHERE migration_id = %L);`,
        company.trading_address_migration_id,
        company.migration_id
      );
  });

  ownersQuery = "";
  owners.forEach((owner) => {
    owner = cleanInput(owner);
    ownersQuery += pgFormat(
      "UPDATE company SET owner_fullname = %L WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = %L);",
      owner.fullname,
      owner.migration_id
    );

    ownersQuery += pgFormat(
      "UPDATE company SET owner_email = %L WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = %L);",
      owner.email,
      owner.migration_id
    );

    ownersQuery += pgFormat(
      "UPDATE company SET owner_phone = %L WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = %L);",
      owner.phone,
      owner.migration_id
    );
  });

  membersQuery = "";
  members.forEach((member) => {
    membersQuery += pgFormat(
      "INSERT INTO company_member(market_id, company_id, account_id) VALUES (%L, (SELECT id from company where migration_id= %L ), (SELECT id from account where migration_id = %L));",
      marketId,
      member.company_migration_id,
      member.account_migration_id
    );
  });

  const client = await pgRootPool.connect();

  let insertedAccountsResult: QueryResult;
  let insertedCompaniesResult: QueryResult;

  try {
    await client.query("BEGIN");
    if (accountsQuery)
      insertedAccountsResult = await client.query(accountsQuery, []);

    if (companiesQuery)
      insertedCompaniesResult = await client.query(companiesQuery, []);

    if (membersQuery) await client.query(membersQuery, []);
    if (ownersQuery) await client.query(ownersQuery, []);
    if (addressQuery) await client.query(addressQuery, []);
    if (addressCompaniesQuery) await client.query(addressCompaniesQuery, []);

    await client.query("COMMIT");
  } catch (error) {
    // eslint-disable-next-line
    logger.error("Error importing user and companies in db", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const accountsToImport = [];
  for (const account of accounts) {
    let hash;
    const accountToImport: any = account;

    if (accountToImport.password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hash = await bcrypt.hash(accountToImport.password, salt);
    }

    accountsToImport.push({
      email: accountToImport.email,
      email_verified: true,
      user_metadata: {
        intouch_role: accountToImport.role,
        first_name: accountToImport.first_name,
        last_name: accountToImport.last_name,
        market: marketDomain
      },
      app_metadata: {
        terms_to_accept: true
      },
      ...(hash ? { password_hash: hash } : {})
    });
  }

  const auth0Job = await auth0.importUserFromJson(accountsToImport);

  const result = {
    message: "success",
    accounts: insertedAccountsResult?.rows?.map(({ id }) => id),
    companies: insertedCompaniesResult?.rows?.map(({ id }) => id),
    dryRun: args.input.dryRun,
    auth0Job
  };

  return result;
};
