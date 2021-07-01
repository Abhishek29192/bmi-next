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
        exportGqlSchemaPath: "schema.graphql",
        graphiql: true,
        enhanceGraphiql: true,
        enableQueryBatching: true,
        legacyRelations: "omit",
        allowExplain: true
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
        legacyRelations: "omit",
        allowExplain: false
      } as PostGraphileOptions<Request, Response>);

export default {
  postgraphile
};