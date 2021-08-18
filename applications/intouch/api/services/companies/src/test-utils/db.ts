import { resolve } from "path";
import { config } from "dotenv";
import { PoolConfig, Pool } from "pg";

config({
  path: resolve(__dirname, "../../.env")
});

let pool;
export const getDbPool = () => {
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
    await client.query(`SET LOCAL ROLE TO '${role}'`);
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
