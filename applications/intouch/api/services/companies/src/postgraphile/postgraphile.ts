import postgraphile from "postgraphile";
import { getDbPool } from "../db";
import postGraphileOptions from "./postGraphileOpts";

export default () => {
  const { PG_SCHEMA } = process.env;
  const dbPool = getDbPool();
  return postgraphile(dbPool, PG_SCHEMA, postGraphileOptions);
};
