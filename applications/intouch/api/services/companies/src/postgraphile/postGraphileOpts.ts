import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import { TagsFilePlugin } from "postgraphile/plugins";
import config from "../config";
import { ExtendPlugin, WrapPlugin } from "./plugins";
import handleErrors from "./handleErrors";

const postGraphileOpts: PostGraphileOptions<Request, Response> = {
  ...config.postgraphile,
  appendPlugins: [
    pgSimplifyInflector,
    FederationPlugin,
    TagsFilePlugin,
    ExtendPlugin,
    WrapPlugin
  ],
  handleErrors,
  additionalGraphQLContextFromRequest: async (req: Request, res: Response) => ({
    user: req.user,
    logger: req.logger,
    pubSub: req.pubSub
  }),
  pgSettings: async ({ user }) => {
    let role: RolesValues;
    const { roles } = config;
    if (Object.prototype.hasOwnProperty.call(roles, user?.role)) {
      role = roles[user?.role];
    } else {
      role = "installer";
    }
    return {
      "app.current_account_id": user?.id,
      "app.current_account_email": user?.email,
      role
    };
  }
};

export default postGraphileOpts;
