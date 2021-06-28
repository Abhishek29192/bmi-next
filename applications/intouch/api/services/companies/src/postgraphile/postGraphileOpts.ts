import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import { TagsFilePlugin } from "postgraphile/plugins";
import { Role } from "@bmi/intouch-api-types";
import config from "../config";
import { Account } from "../types/index";
import { ExtendPlugin, WrapPlugin } from "./plugins";
import handleErrors from "./handleErrors";

type Props = {
  user: Account;
};

const availableRoles: Role[] = [
  "INSTALLER",
  "COMPANY_ADMIN",
  "MARKET_ADMIN",
  "SUPER_ADMIN"
];

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
  pgSettings: async ({ user }: Props) => {
    let role = user?.role;
    if (!availableRoles.includes(user?.role)) {
      role = "INSTALLER";
    }

    return {
      "app.current_account_id": user?.intouchUserId,
      "app.current_account_email": user?.email,
      role: role.toLocaleLowerCase()
    };
  }
};

export default postGraphileOpts;
