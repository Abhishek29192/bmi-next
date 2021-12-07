import { Pool, PoolConfig } from "pg";
import pgFormat from "pg-format";
import { getSecret } from "./utils/secrets";

const executeQuery = async (query) => {
  const { PGUSER, PGDATABASE, PGPORT, GCP_SECRET_PROJECT, PG_SSL_HOST } =
    process.env;

  const PG_SSL_CLIENT_KEY = await getSecret(
    GCP_SECRET_PROJECT,
    "PG_SSL_CLIENT_KEY"
  );
  const PG_SSL_CLIENT_CERT = await getSecret(
    GCP_SECRET_PROJECT,
    "PG_SSL_CLIENT_CERT"
  );
  const PG_SSL_SERVER_CA = await getSecret(
    GCP_SECRET_PROJECT,
    "PG_SSL_SERVER_CA"
  );
  const COMPANIES_DB_PASSWORD = await getSecret(
    GCP_SECRET_PROJECT,
    "COMPANIES_DB_PASSWORD"
  );
  const COMPANIES_DB_HOST = await getSecret(
    GCP_SECRET_PROJECT,
    "COMPANIES_DB_HOST"
  );

  const dbConfig: PoolConfig = {
    host: COMPANIES_DB_HOST,
    port: parseInt(PGPORT),
    user: PGUSER,
    database: PGDATABASE,
    password: COMPANIES_DB_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: PG_SSL_SERVER_CA,
      key: PG_SSL_CLIENT_KEY,
      cert: PG_SSL_CLIENT_CERT,
      host: PG_SSL_HOST
    }
  };

  try {
    const pool = new Pool(dbConfig);
    const { rows } = await pool.query(query);
    pool.end();

    return rows;
  } catch (error) {
    // eslint-disable-next-line
    console.log("Error syncing the db:", error.message);
    throw error;
  }
};
const getDoceboUsers = async () => {
  const query =
    "select docebo_user_id from account where docebo_user_id is not null";
  const doceboUserIds = await executeQuery(query);
  return doceboUserIds.map((doceboUser) => `${doceboUser.docebo_user_id}`);
};
export const insertCertification = async (certifications) => {
  const table = "certification";

  const accountDoceboUserIds = await getDoceboUsers();

  //filter certifications by accountDoceboUserIds
  const certToInsert = certifications.filter(({ userId }) =>
    accountDoceboUserIds.includes(userId)
  );

  const insertQuery = pgFormat(
    `INSERT INTO ${table} (docebo_user_id,technology,name,expiry_date) VALUES %L ;`,
    certToInsert.map(({ userId, code, title, to_renew_in }) => [
      userId,
      code,
      title,
      to_renew_in
    ])
  );

  if (insertQuery) {
    const query = `TRUNCATE TABLE ${table}; ${insertQuery}`;
    executeQuery(query);
  }
};
