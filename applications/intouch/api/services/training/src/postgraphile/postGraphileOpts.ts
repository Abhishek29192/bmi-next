import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import config from "../config";
import {
  ExtendSchemaPlugin,
  RemoveNodeAndQueryFieldsPlugin,
  StripNodeInterfacePlugin
} from "./plugins";

const postGraphileOpts: PostGraphileOptions<Request, Response> = {
  ...config.postgraphile,
  appendPlugins: [
    pgSimplifyInflector,
    FederationPlugin,
    ExtendSchemaPlugin,
    RemoveNodeAndQueryFieldsPlugin,
    StripNodeInterfacePlugin
  ],
  additionalGraphQLContextFromRequest: async (req: Request, res: Response) => ({
    docebo: req.docebo
  })
};

export default postGraphileOpts;
