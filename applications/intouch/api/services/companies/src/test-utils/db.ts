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

export const transaction = async (
  pool,
  { role, accountUuid, accountEmail },
  query: string,
  params: any = []
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (accountUuid) {
      await client.query(
        `SET LOCAL app.current_account_id TO '${accountUuid}'`
      );
      await client.query(
        `SET LOCAL app.current_account_email TO '${accountEmail}'`
      );
    }
    // Note: Postgres roles are lowercase
    await client.query(`SET LOCAL ROLE TO '${role.toLowerCase()}'`);
    const res = await client.query(query, params);
    await client.query("COMMIT");
    return res;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
};

// We'd expect something here with an id at least
type DBRecord = {
  id: string;
  [key: string]: any;
};
export type CleanupBucketType = Record<string, Array<DBRecord>>;
export const cleanupBucket: CleanupBucketType = {};

export const cleanup = (context: Context) => {
  const { client, cleanupBucket } = context;

  // Delete all records in the cleanupBucket
  Object.entries(cleanupBucket).forEach(async ([tableName, records]) => {
    await records.forEach(async (record) => {
      const query = `DELETE from ${tableName} WHERE id = $1`;
      const parameters = [record.id];

      if (LOG_VERBOSE) {
        // eslint-disable-next-line no-console
        console.log({ query, parameters });
      }

      await client.query(query, parameters);
    });
  });
};

export type Context = {
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
): Promise<any> => {
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
