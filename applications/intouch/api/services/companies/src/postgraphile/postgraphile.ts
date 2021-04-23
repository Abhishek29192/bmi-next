import postgraphile from "postgraphile";
import { PoolConfig } from "pg";
import postGraphileOptions from "./postGraphileOpts";

const { PG_SCHEMA, PG_USER, PASSWORD, HOST, DATABASE, PG_PORT } = process.env;

const dbConfig: PoolConfig = {
  host: HOST,
  port: parseInt(PG_PORT),
  user: PG_USER,
  database: DATABASE,
  password: PASSWORD
};

export default postgraphile(dbConfig, PG_SCHEMA, postGraphileOptions);
