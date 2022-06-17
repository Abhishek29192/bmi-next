import { Pool, PoolConfig } from "pg";
import pgFormat from "pg-format";
import { getSecret } from "@bmi-digital/functions-secret-client";
import { ReportRecord } from "./__tests__/helper";

const executeQuery = async (query: string) => {
  const {
    PGUSER,
    PGDATABASE,
    PGHOST,
    PGPASSWORD,
    PGPORT,
    PG_SSL_HOST,
    NODE_ENV
  } = process.env;
  const isLocal = NODE_ENV === "local";

  const PG_SSL_CLIENT_KEY = await getSecret("PG_SSL_CLIENT_KEY");
  const PG_SSL_CLIENT_CERT = await getSecret("PG_SSL_CLIENT_CERT");
  const PG_SSL_SERVER_CA = await getSecret("PG_SSL_SERVER_CA");
  const COMPANIES_DB_PASSWORD = await getSecret("COMPANIES_DB_PASSWORD");
  const COMPANIES_DB_HOST = await getSecret("COMPANIES_DB_HOST");

  const dbConfig: PoolConfig = {
    host: isLocal ? PGHOST : COMPANIES_DB_HOST,
    port: parseInt(PGPORT as string),
    user: PGUSER,
    database: PGDATABASE,
    password: isLocal ? PGPASSWORD : COMPANIES_DB_PASSWORD,
    ...(isLocal
      ? {}
      : {
          ssl: {
            rejectUnauthorized: true,
            ca: PG_SSL_SERVER_CA,
            key: PG_SSL_CLIENT_KEY,
            cert: PG_SSL_CLIENT_CERT,
            host: PG_SSL_HOST
          }
        })
  };

  const pool = new Pool(dbConfig);
  const { rows } = await pool.query(query);
  pool.end();

  return rows;
};

const getDoceboUsers = async () => {
  const query =
    "select docebo_user_id from account where docebo_user_id is not null";
  const doceboUserIds = await executeQuery(query);
  return doceboUserIds.map((doceboUser) => `${doceboUser.docebo_user_id}`);
};

export const insertCertification = async (certifications: ReportRecord[]) => {
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

  if (certToInsert.length) {
    const query = `TRUNCATE TABLE ${table}; ${insertQuery}`;
    await executeQuery(query);

    return `Certificate table has truncated and ${certToInsert.length} certificates have been inserted`;
  }
  return `No certificate to be inserted`;
};
