import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";

export default process.env.NODE_ENV === "production"
  ? {
      postgraphile: {
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
      } as PostGraphileOptions<Request, Response>
    }
  : {
      postgraphile: {
        subscriptions: false,
        retryOnInitFail: true,
        dynamicJson: true,
        setofFunctionsContainNulls: false,
        ignoreRBAC: false,
        ignoreIndexes: false,
        extendedErrors: ["errcode"],
        graphiql: false,
        enableQueryBatching: true,
        disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
        legacyRelations: "omit"
      } as PostGraphileOptions<Request, Response>
    };
