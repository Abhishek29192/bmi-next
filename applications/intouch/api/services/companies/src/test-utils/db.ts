import { resolve } from "path";
import { config } from "dotenv";
import { PoolConfig, Pool, Client } from "pg";
import requiredFields from "./requiredFields";

config({
  path: resolve(__dirname, "../../.env")
});

let pool: Pool;
export const getDbPool = (): Pool => {
  if (!pool) {
    const { PG_USER, PG_DATABASE, PG_PORT, PG_PASSWORD, PG_HOST } = process.env;

    const dbConfig: PoolConfig = {
      host: PG_HOST,
      port: parseInt(PG_PORT),
      user: PG_USER,
      database: PG_DATABASE,
      password: PG_PASSWORD
    };

    pool = new Pool(dbConfig);
  }

  return pool;
};

// Sets the account credentials on the client connection
// for the duration of a transaction
export const actAs = async (client, account) => {
  if (!(account.id && account.email && account.role)) {
    throw new Error(
      "Need account `id`, `email`, and `role` to act as the account."
    );
  }

  await client.query(`SET LOCAL app.current_account_id TO '${account.id}'`);
  await client.query(
    `SET LOCAL app.current_account_email TO '${account.email}'`
  );
  // Note: Postgres roles are lowercase
  await client.query(`SET LOCAL ROLE TO '${account.role.toLowerCase()}'`);

  if (account.role === "SUPER_ADMIN") {
    // Set the market if super_admin
    await client.query(
      `SET LOCAL app.current_market TO '${account.market_id}'`
    );
  }
};

// We'd expect something here with an id at least
type DBRecord = {
  id: string;
  [key: string]: any;
};
export type CleanupBucketType = Record<string, Array<DBRecord>>;
export const cleanupBucket: CleanupBucketType = {};

export const cleanup = async (context: Context) => {
  const { pool, cleanupBucket } = context;

  for await (const entity of Object.entries(cleanupBucket)) {
    const [tableName, records] = entity;

    const ids = records.map((record) => record.id);

    const query = `DELETE from ${tableName} WHERE id = ANY($1)`;
    const parameters = [ids];

    await pool.query(query, parameters);
  }
};

export type Context = {
  pool?: Pool;
  client: Client;
  // This is optional, probably don't need it if we always use transactions.
  // Leaving for now just in case.
  cleanupBucket?: CleanupBucketType;
};

export const curryContext =
  (context: Context, func) =>
  (...args) =>
    func(context, ...args);

export const insertOne = async (
  context: Context,
  tableName,
  record
): Promise<DBRecord> => {
  const { client, cleanupBucket } = context;

  // Picking up some required fields for the table as default
  // eslint-disable-next-line security/detect-object-injection
  record = { ...(requiredFields[tableName] || {}), ...record };
  const fields = Object.keys(record).join(", ");
  const placeholders = Object.values(record)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const query = `INSERT into ${tableName} (${fields}) VALUES (${placeholders}) ON CONFLICT DO NOTHING RETURNING *`;
  const parameters = Object.values(record);

  // TODO: Need to check for errors? Or will throw?
  const { rows } = await client.query(query, parameters);
  if (!rows.length) {
    const condition = Object.keys(record)
      .map((key, id) => `${key}=$${id + 1}`)
      .join(" AND ");
    const { rows: existingRows } = await client.query(
      `SELECT * FROM ${tableName} WHERE ${condition}`,
      parameters
    );
    return existingRows[0];
  }

  // add to cleanupBucket
  if (cleanupBucket) {
    // eslint-disable-next-line security/detect-object-injection
    cleanupBucket[tableName] = [...(cleanupBucket[tableName] || []), ...rows];
  }

  return rows[0];
};

export const deleteRow = async (
  context: Context,
  tableName: string,
  record: { [key: string]: string }
): Promise<boolean> => {
  const { client } = context;
  const condition = Object.keys(record)
    .map((key) => {
      const value = record[`${key}`];
      return `${key} = ${typeof value === "string" ? `'${value}'` : value}`;
    })
    .join(" AND ");
  const query = `DELETE FROM ${tableName} WHERE ${condition}`;

  await client.query(query);

  return true;
};

export const PERMISSION_DENIED = (table) =>
  `permission denied for table ${table}`;
export const RLS_ERROR = (table) =>
  `new row violates row-level security policy for table "${table}"`;
export const CONSTRAINT_ERROR = (constraint) =>
  `duplicate key value violates unique constraint "${constraint}"`;

export const initDb = async (pool, client, accountRole = "INSTALLER") => {
  const context = {
    pool,
    client,
    cleanupBucket: {}
  };
  const dbInsertOne = curryContext(context, insertOne);
  const dbDeleteRow = curryContext(context, deleteRow);

  const market = await dbInsertOne("market", {
    domain: "da",
    language: "da",
    projects_enabled: true
  });

  const otherMarket = await dbInsertOne("market", {
    domain: "ww",
    language: "pt"
  });

  const installerSolo = await dbInsertOne("account", {
    role: "INSTALLER",
    email: "somemail1@email.com",
    market_id: market.id
  });

  const installer = await dbInsertOne("account", {
    role: "INSTALLER",
    email: "somemail2@email.com",
    market_id: market.id
  });

  const otherInstaller = await dbInsertOne("account", {
    role: "INSTALLER",
    email: "somemail3@email.com",
    market_id: market.id
  });

  const companyAdminSolo = await dbInsertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail4@email.com",
    market_id: market.id
  });

  const companyAdmin = await dbInsertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail5@email.com",
    market_id: market.id
  });

  const otherCompanyAdmin = await dbInsertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail6@email.com",
    market_id: market.id
  });

  const auditor = await dbInsertOne("account", {
    role: "AUDITOR",
    email: "somemail7@email.com",
    market_id: market.id
  });

  const superAdmin = await dbInsertOne("account", {
    role: "SUPER_ADMIN",
    email: "somemail8@email.com"
  });

  const marketAdmin = await dbInsertOne("account", {
    role: "MARKET_ADMIN",
    email: "somemail9@email.com",
    market_id: market.id
  });

  const company = await dbInsertOne("company", {
    name: "Name 2",
    market_id: market.id
  });

  const account = await dbInsertOne("account", {
    role: accountRole,
    email: "somemail10@email.com",
    market_id: market.id
  });

  const otherCompany = await dbInsertOne("company", {
    name: "Name 1",
    market_id: market.id
  });

  const otherAccount = await dbInsertOne("account", {
    role: accountRole,
    email: "somemail11@email.com",
    market_id: market.id
  });

  const otherMarketAccount = await dbInsertOne("account", {
    role: accountRole,
    email: "somemail12@email.com",
    market_id: otherMarket.id
  });

  const address = await dbInsertOne("address", {
    first_line: "First Line",
    postcode: "postcode"
  });

  const otherAddress = await dbInsertOne("address", {
    first_line: "First Line",
    postcode: "postcode"
  });

  const document = await dbInsertOne("company_document", {
    company_id: company.id
  });

  const otherDocument = await dbInsertOne("company_document", {
    company_id: otherCompany.id
  });

  const invitation = await dbInsertOne("invitation", {
    sender_account_id: account.id,
    company_id: company.id,
    invitee: "email@email.com",
    personal_note:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    status: "NEW"
  });

  const project = await dbInsertOne("project", {
    company_id: company.id
  });

  const otherProject = await dbInsertOne("project", {
    company_id: otherCompany.id
  });

  const product = await dbInsertOne("product", {
    name: "Name",
    market_id: market.id,
    technology: "PITCHED",
    bmi_ref: "test_bmi_ref",
    maximum_validity_years: 1,
    published: true,
    brand: "test_brand",
    family: "test_family"
  });

  const system = await dbInsertOne("system", {
    name: "Name",
    market_id: market.id,
    technology: "PITCHED",
    bmi_ref: "test_bmi_ref_0",
    maximum_validity_years: 1,
    published: true
  });

  const otherMarketSystem = await dbInsertOne("system", {
    name: "Name",
    market_id: otherMarket.id,
    technology: "PITCHED",
    bmi_ref: "test_bmi_ref_1",
    maximum_validity_years: 1,
    published: true
  });

  const note = await dbInsertOne("note", {
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    author_id: account.id,
    project_id: project.id
  });

  const otherMarketNote = await dbInsertOne("note", {
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    author_id: otherMarketAccount.id,
    project_id: project.id
  });

  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: account.id
  });
  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherAccount.id
  });
  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: companyAdmin.id
  });
  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: installer.id
  });
  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherCompanyAdmin.id
  });
  await dbInsertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherInstaller.id
  });

  return {
    context,
    dbInsertOne,
    dbDeleteRow,
    market,
    otherMarket,
    installerSolo,
    installer,
    companyAdminSolo,
    companyAdmin,
    otherCompanyAdmin,
    auditor,
    superAdmin,
    marketAdmin,
    company,
    account,
    otherCompany,
    otherAccount,
    otherMarketAccount,
    address,
    otherAddress,
    document,
    otherDocument,
    invitation,
    project,
    otherProject,
    product,
    system,
    otherMarketSystem,
    note,
    otherMarketNote
  };
};
