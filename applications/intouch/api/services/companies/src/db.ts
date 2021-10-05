import { PoolConfig, Pool, PoolClient } from "pg";

let pool;

const formatCert = (cert) => {
  return cert
    .replace("-----BEGIN CERTIFICATE-----", "-----BEGIN CERTIFICATE-----\\n")
    .replace("-----END CERTIFICATE-----", "\\n-----END CERTIFICATE-----");
};

const formatKey = (cert) => {
  return cert
    .replace(
      "-----BEGIN RSA PRIVATE KEY-----",
      "-----BEGIN RSA PRIVATE KEY-----\\n"
    )
    .replace(
      "-----END RSA PRIVATE KEY-----",
      "\\n-----END RSA PRIVATE KEY-----"
    );
};

export const getDbPool = () => {
  if (!pool) {
    const {
      PG_USER,
      PG_DATABASE,
      PG_PORT,
      PG_PASSWORD,
      PG_HOST,
      PG_SSL,
      PG_SSL_CLIENT_KEY,
      PG_SSL_CLIENT_CERT,
      PG_SSL_SERVER_CA,
      PG_REJECT_UNAUTHORIZED
    } = process.env;

    let dbConfig: PoolConfig = {
      host: PG_HOST,
      port: parseInt(PG_PORT),
      user: PG_USER,
      database: PG_DATABASE,
      password: PG_PASSWORD,
      ssl:
        PG_SSL === "true"
          ? {
              rejectUnauthorized: PG_REJECT_UNAUTHORIZED === "true",
              ca: formatCert(PG_SSL_SERVER_CA).replace(/\\n/g, "\n"),
              key: formatKey(PG_SSL_CLIENT_KEY).replace(/\\n/g, "\n"),
              cert: formatCert(PG_SSL_CLIENT_CERT).replace(/\\n/g, "\n")
            }
          : false
    };

    pool = new Pool(dbConfig);
  }

  return pool;
};

export const getRootClient = async (): Promise<PoolClient> => {
  return await getDbPool().connect();
};
