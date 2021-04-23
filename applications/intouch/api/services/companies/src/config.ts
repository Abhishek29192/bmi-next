import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";

const postgraphile =
  process.env.NODE_ENV !== "production"
    ? ({
        subscriptions: false,
        watchPg: true,
        dynamicJson: true,
        setofFunctionsContainNulls: false,
        ignoreRBAC: false,
        ignoreIndexes: false,
        showErrorStack: "json",
        extendedErrors: ["hint", "detail", "errcode"],
        exportGqlSchemaPath: "schema.graphql",
        graphiql: true,
        enhanceGraphiql: true,
        enableQueryBatching: true,
        legacyRelations: "omit"
      } as PostGraphileOptions<Request, Response>)
    : ({
        subscriptions: false,
        retryOnInitFail: true,
        dynamicJson: true,
        setofFunctionsContainNulls: false,
        ignoreRBAC: false,
        ignoreIndexes: false,
        extendedErrors: ["errcode"],
        graphiql: false,
        enableQueryBatching: true,
        disableQueryLog: true,
        legacyRelations: "omit"
      } as PostGraphileOptions<Request, Response>);

const roles: Record<RolesKey, RolesValues> = {
  SUPER_ADMIN: "super_admin",
  MARKET_ADMIN: "market_admin",
  INSTALLER: "installer",
  COMPANY_ADMIN: "company_admin"
};

export default {
  postgraphile,
  roles
};
