import postgraphile from "postgraphile";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import confis from "../config";
import { CompanyWrapPlugin } from "./plugins";

const { PG_SCHEMA, PG_USER, PASSWORD, HOST, DATABASE, PG_PORT } = process.env;

const postGraphileOptions = {
  ...confis.postgraphile,
  appendPlugins: [pgSimplifyInflector, FederationPlugin, CompanyWrapPlugin],
  async additionalGraphQLContextFromRequest(req, res) {
    const user = {
      id: req.headers["x-authenticated-internal-user-id"],
      role: req.headers["x-authenticated-role"]
    };

    req.user = user;

    return { user: req.user };
  },
  pgSettings: async ({ user }) => {
    const { role = "installer", id: userId = -1 } = user;
    return {
      role,
      "app.current_account": userId
    };
  }
};

export default postgraphile(
  `postgres://${PG_USER}:${PASSWORD}@${HOST}:${PG_PORT}/${DATABASE}`,
  PG_SCHEMA,
  postGraphileOptions
);
