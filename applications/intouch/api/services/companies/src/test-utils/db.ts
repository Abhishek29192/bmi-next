import dotenv from "dotenv";
import { PoolConfig, Pool } from "pg";

dotenv.config();

let pool;
export const getDbPool = () => {
  if (!pool) {
    const {
      PG_TEST_USER,
      PG_TEST_DATABASE,
      PG_TEST_PORT,
      PG_TEST_PASSWORD,
      PG_TEST_HOST
    } = process.env;

    const dbConfig: PoolConfig = {
      host: PG_TEST_HOST,
      port: parseInt(PG_TEST_PORT),
      user: PG_TEST_USER,
      database: PG_TEST_DATABASE,
      password: PG_TEST_PASSWORD
    };

    pool = new Pool(dbConfig);
  }

  return pool;
};

export const transaction = async (
  { role, accountUuid, accountEmail },
  query: string,
  params: any = []
) => {
  const client = await getDbPool().connect();
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
