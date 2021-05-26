import postgraphile from "postgraphile";
import { PoolConfig } from "pg";
import postGraphileOptions from "./postGraphileOpts";

const { PG_SCHEMA, PG_USER, PG_DATABASE, PG_PORT } = process.env;

export default ({ dbPassword, dbHost }) => {
  const dbConfig: PoolConfig = {
    host: dbHost,
    port: parseInt(PG_PORT),
    user: PG_USER,
    database: PG_DATABASE,
    password: dbPassword
  };

  return postgraphile(dbConfig, PG_SCHEMA, postGraphileOptions);
};
