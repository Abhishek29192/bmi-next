import postgraphile from "postgraphile";
import { PoolConfig } from "pg";
import postGraphileOptions from "./postGraphileOpts";

export default () => {
  const { PG_SCHEMA, PG_USER, PG_DATABASE, PG_PORT, PG_PASSWORD, PG_HOST } =
    process.env;

  const dbConfig: PoolConfig = {
    host: PG_HOST,
    port: parseInt(PG_PORT),
    user: PG_USER,
    database: PG_DATABASE,
    password: PG_PASSWORD
  };

  return postgraphile(dbConfig, PG_SCHEMA, postGraphileOptions);
};
