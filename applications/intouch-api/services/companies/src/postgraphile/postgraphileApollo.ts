import pg from "pg";
import { makeSchemaAndPlugin } from "postgraphile-apollo-server";
import FederationPlugin from "@graphile/federation";
import dotenv from "dotenv";
import { CompanyWrapPlugin } from "./plugins";

dotenv.config();

const postGraphileOptions = {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  appendPlugins: [FederationPlugin, CompanyWrapPlugin],
  pgSettings: async (req) => {
    const internalUserId = req.headers.get("x-authenticated-internal-user-id");
    let role = req.headers.get("x-authenticated-role");

    // I need this because req.headers.get return the word "undefined" as string instead of undefined
    if (!role || role === "undefined") {
      role = "installer";
    }

    return {
      role,
      "app.current_account": internalUserId
    };
  }
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
