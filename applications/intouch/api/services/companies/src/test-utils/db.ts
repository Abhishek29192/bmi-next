import { resolve } from "path";
import { config } from "dotenv";
import { PoolConfig, Pool, Client } from "pg";
import requiredFields from "./requiredFields";

const LOG_VERBOSE = false;

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

    if (LOG_VERBOSE) {
      // eslint-disable-next-line no-console
      console.log({ query, parameters });
    }

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
  record = { ...(requiredFields[tableName] || {}), ...record };
  const fields = Object.keys(record).join(", ");
  const placeholders = Object.values(record)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const query = `INSERT into ${tableName} (${fields}) VALUES (${placeholders}) RETURNING *`;
  const parameters = Object.values(record);

  if (LOG_VERBOSE) {
    // eslint-disable-next-line no-console
    console.log({ query, parameters });
  }

  // TODO: Need to check for errors? Or will throw?
  const { rows } = await client.query(query, parameters);

  // add to cleanupBucket
  if (cleanupBucket) {
    cleanupBucket[tableName] = [...(cleanupBucket[tableName] || []), ...rows];
  }

  return rows[0];
};

export const PERMISSION_DENIED = (table) =>
  `permission denied for table ${table}`;
export const RLS_ERROR = (table) =>
  `new row violates row-level security policy for table "${table}"`;
