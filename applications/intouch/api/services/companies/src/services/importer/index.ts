import * as csv from "fast-csv";
import pgFormat from "pg-format";

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

export const importAccountsCompaniesFromCVS = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgRootPool } = context;
  const { input } = args;

  const files = await input.files;

  let companiesQuery = "";
  let membersQuery = "";
  let ownersQuery = "";
  let addressQuery = "";
  let addressCompaniesQuery = "";
  let accountsQuery = "";

  let accounts, companies, addresses, owners, members;

  let marketDomain = null;
  for await (let file of files) {
    const { filename, ...f } = await file;

    const parsedFile: any[] = await singleImport({ filename, ...f });

    const [market, type] = filename.split("-");

    if (marketDomain && market !== marketDomain) {
      throw new Error("One file has a different market");
    }

    marketDomain = market;

    if (type === "companies.csv") {
      companies = parsedFile;
    } else if (type === "addresses.csv") {
      addresses = parsedFile;
    } else if (type === "owners.csv") {
      owners = parsedFile;
    } else if (type === "members.csv") {
      members = parsedFile;
    } else if (type === "accounts.csv") {
      accounts = parsedFile;
    }
  }

  if (!marketDomain) {
    throw new Error("Missing market");
  }

  const { rows } = await pgRootPool.query(
    "SELECT id FROM market WHERE domain = $1",
    [marketDomain]
  );

  const marketId = rows[0].id;

  accountsQuery = pgFormat(
    "INSERT INTO account(market_id, status, role, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, migration_id) VALUES %L",
    accounts.map((account) => [
      parseInt(marketId),
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

  companiesQuery = pgFormat(
    "INSERT INTO company(market_id, migration_id, name, tier, status, tax_number, about_us, logo, phone, public_email, registered_address_migration_id, trading_address_migration_id, website, linked_in) VALUES %L",
    companies.map((company) => [
      parseInt(marketId),
      company.migration_id,
      company.name,
      company.tier,
      company.status,
      company.tax_number,
      company.about_us,
      company.logo,
      company.phone,
      company.public_email,
      company.registered_address_migration_id,
      company.trading_address_migration_id,
      company.website,
      company.linked_in
    ])
  );

  addressQuery = pgFormat(
    "INSERT INTO address(migration_id, first_line, second_line, town, country, postcode) VALUES %L",
    addresses.map((address) => [
      address.migration_id,
      address.first_line,
      address.second_line,
      address.town,
      address.country,
      address.postcode
    ])
  );

  companies.forEach((company) => {
    addressCompaniesQuery +=
      "UPDATE company SET registered_address_id = " +
      "(SELECT id FROM address WHERE migration_id = '" +
      company.registered_address_migration_id +
      "') " +
      "WHERE id = (SELECT id FROM company WHERE migration_id = '" +
      company.migration_id +
      "');\n";
    addressCompaniesQuery +=
      "UPDATE company SET trading_address_id = " +
      "(SELECT id FROM address WHERE migration_id = '" +
      company.trading_address_migration_id +
      "') " +
      "WHERE id = (SELECT id FROM company WHERE migration_id = '" +
      company.migration_id +
      "');\n";
  });

  owners.forEach((owner) => {
    owner = cleanInput(owner);
    ownersQuery +=
      "UPDATE company SET owner_fullname = '" +
      owner.fullname +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
    ownersQuery +=
      "UPDATE company SET owner_email = '" +
      owner.email +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
    ownersQuery +=
      "UPDATE company SET owner_phone = '" +
      owner.phone +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
  });

  members.forEach((member) => {
    membersQuery +=
      "INSERT INTO company_member(market_id, company_id, account_id) VALUES (" +
      marketId +
      ", (SELECT id from company where migration_id='" +
      member.company_migration_id +
      "'), (SELECT id from account where migration_id='" +
      member.account_migration_id +
      "'));";
  });

  const client = await pgRootPool.connect();

  try {
    await client.query("BEGIN");

    await client.query(accountsQuery, []);
    await client.query(companiesQuery, []);
    await client.query(membersQuery, []);
    await client.query(ownersQuery, []);
    await client.query(addressQuery, []);
    await client.query(addressCompaniesQuery, []);

    const result = await auth0.importUserFromJson(
      accounts.map((account) => ({
        email: account.email,
        email_verified: true,
        user_metadata: {
          intouch_role: "COMPANY_ADMIN",
          first_name: account.first_name,
          last_name: account.last_name,
          market: marketDomain
        },
        app_metadata: {
          terms_to_accept: true
        },
        password_hash:
          "$2b$10$ebYjd4xVOjHcN7yBFL69RuFfyt2Sp2ugr.Iw7SzLRZERYsgkr2Qra"
      }))
    );

    // eslint-disable-next-line
    console.log("result", result);

    await client.query("COMMIT");
  } catch (error) {
    // eslint-disable-next-line
    console.log("error", error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};
