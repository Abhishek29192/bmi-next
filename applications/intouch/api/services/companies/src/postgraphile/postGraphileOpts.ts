import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import config from "../config";
import { WrapPlugin } from "./plugins";

const postGraphileOpts: PostGraphileOptions<Request, Response> = {
  ...config.postgraphile,
  appendPlugins: [pgSimplifyInflector, FederationPlugin, WrapPlugin],
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    req.user = {
      id: req.headers["x-authenticated-internal-user-id"] as string,
      role: req.headers["x-authenticated-role"] as RolesKey
    };

    return { user: req.user };
  },
  pgSettings: async ({ user }) => {
    let role: RolesValues;
    const { roles } = config;
    if (Object.prototype.hasOwnProperty.call(roles, user.role)) {
      role = roles[user.role];
    } else {
      role = "installer";
    }

    return {
      "app.current_account": user.id,
      role
    };
  }
};

export default postGraphileOpts;
