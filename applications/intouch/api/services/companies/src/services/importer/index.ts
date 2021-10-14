import * as csv from "fast-csv";
import pgFormat from "pg-format";

// function to clean input data.
function cleanInput(record) {
  for (const property in record) {
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
  const { pgClient } = context;
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

  const { rows } = await pgClient.query(
    "SELECT id FROM market WHERE domain = $1",
    [marketDomain]
  );

  const marketId = rows[0].id;

  accounts = accounts.map((item) => ({
    ...item,
    market_id: marketId
  }));

  members = members.map((item) => ({
    ...item,
    market_id: marketId
  }));

  companies = companies.map((item) => ({
    ...item,
    market_id: marketId
  }));

  accountsQuery = pgFormat(
    "INSERT INTO account(market_id, status, role, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, migration_id) VALUES %L",
    accounts
  );

  companiesQuery = pgFormat(
    "INSERT INTO company(market_id, migration_id, name, tier, status, tax_number, about_us, logo, phone, public_email, registered_address_migration_id, trading_address_migration_id, website, linked_in) VALUES %L",
    companies
  );

  addressQuery = pgFormat(
    "INSERT INTO address(migration_id, first_line, second_line, town, country, postcode, coordinates) VALUES %L",
    addresses
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

  try {
    await pgClient.query("SAVEPOINT graphql_accounts_companies_mutation");

    await pgClient.query(accountsQuery, []);
    await pgClient.query(companiesQuery, []);
    await pgClient.query(membersQuery, []);
    await pgClient.query(ownersQuery, []);
    await pgClient.query(addressQuery, []);
    await pgClient.query(addressCompaniesQuery, []);
    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_accounts_companies_mutation"
    );
  } catch (error) {
    // eslint-disable-next-line
    console.log("error", error);
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};
