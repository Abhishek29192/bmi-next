import pg from "pg";
import { makeSchemaAndPlugin } from "postgraphile-apollo-server";
import FederationPlugin from "@graphile/federation";
import dotenv from "dotenv";

dotenv.config();

const postGraphileOptions = {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  appendPlugins: [FederationPlugin]
};

const { PG_SCHEMA, PG_USER, PASSWORD, HOST, DATABASE, PG_PORT } = process.env;

const pgPool = new pg.Pool({
  user: PG_USER,
  password: PASSWORD,
  port: +PG_PORT,
  host: HOST,
  database: DATABASE
});

// See https://www.graphile.org/postgraphile/usage-schema/ for schema-only usage guidance
const postgraphileApolloInstance = () =>
  makeSchemaAndPlugin(pgPool, PG_SCHEMA, postGraphileOptions);

export default postgraphileApolloInstance;
