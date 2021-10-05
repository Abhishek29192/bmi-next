import postgraphile from "postgraphile";
import { PoolConfig } from "pg";
import postGraphileOptions from "./postGraphileOpts";

export default () => {
  const {
    PG_USER,
    PG_DATABASE,
    PG_PORT,
    PG_PASSWORD,
    PG_HOST,
    PG_SSL,
    PG_SCHEMA,
    PG_SSL_CLIENT_KEY,
    PG_SSL_CLIENT_CERT,
    PG_SSL_SERVER_CA,
    PG_REJECT_UNAUTHORIZED,
    PG_SSL_HOST
  } = process.env;

  const dbConfig: PoolConfig = {
    host: PG_HOST,
    port: parseInt(PG_PORT),
    user: PG_USER,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    ssl:
      PG_SSL === "true"
        ? {
            rejectUnauthorized: PG_REJECT_UNAUTHORIZED === "true",
            ca: PG_SSL_SERVER_CA,
            key: PG_SSL_CLIENT_KEY,
            cert: PG_SSL_CLIENT_CERT,
            host: PG_SSL_HOST
          }
        : false
  };

  return postgraphile(dbConfig, PG_SCHEMA, postGraphileOptions);
};
