import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import { TagsFilePlugin } from "postgraphile/plugins";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import config from "../config";
import handleErrors from "./handleErrors";
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
    StripNodeInterfacePlugin,
    TagsFilePlugin
  ],
  handleErrors,
  additionalGraphQLContextFromRequest: async (req: Request, res: Response) => ({
    docebo: req.docebo,
    logger: req.logger
  })
};

export default postGraphileOpts;
