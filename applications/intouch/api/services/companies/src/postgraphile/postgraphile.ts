import postgraphile from "postgraphile";
import postGraphileOpts from "./postGraphileOpts";

const { PG_SCHEMA, PG_USER, PASSWORD, HOST, DATABASE, PG_PORT } = process.env;

export default postgraphile(
  `postgres://${PG_USER}:${PASSWORD}@${HOST}:${PG_PORT}/${DATABASE}`,
  PG_SCHEMA,
  postGraphileOpts
);
