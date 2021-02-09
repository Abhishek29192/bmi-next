import { postgraphile } from "postgraphile";
import FederationPlugin from "@graphile/federation";
import { AuthorWrapResolversPlugin } from "./plugins";

const { DATABASE, PG_USER, PASSWORD, HOST, PG_SCHEMA } = process.env;

const postgraphileInstance = postgraphile(
  {
    database: DATABASE,
    user: PG_USER,
    password: PASSWORD,
    host: HOST,
    port: 5432
  },
  PG_SCHEMA,
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [AuthorWrapResolversPlugin, FederationPlugin]
  }
);

export default postgraphileInstance;
