import { postgraphile } from "postgraphile";
import FederationPlugin from "@graphile/federation";
import { PgNodeAliasPostGraphile } from "graphile-build-pg";
import {
  RemoveNodeAndQueryFieldsPlugin,
  StripNodeInterfacePlugin
} from "./plugins";

const { DATABASE, PG_USER, PASSWORD, HOST, PG_SCHEMA, PG_PORT } = process.env;

const postgraphileInstance = postgraphile(
  {
    database: DATABASE,
    user: PG_USER,
    password: PASSWORD,
    host: HOST,
    port: +PG_PORT
  },
  PG_SCHEMA,
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [
      FederationPlugin,
      RemoveNodeAndQueryFieldsPlugin,
      StripNodeInterfacePlugin
    ],
    skipPlugins: [PgNodeAliasPostGraphile]
  }
);

export default postgraphileInstance;
