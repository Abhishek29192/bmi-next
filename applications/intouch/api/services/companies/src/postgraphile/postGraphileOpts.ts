import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import PostGraphileNestedMutations from "postgraphile-plugin-nested-mutations";
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import FederationPlugin from "@graphile/federation";
import { TagsFilePlugin } from "postgraphile/plugins";
import { Role } from "@bmi/intouch-api-types";
import config from "../config";
import { Account } from "../types/index";
import { getDbPool } from "../db";
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
    ConnectionFilterPlugin,
    pgSimplifyInflector,
    FederationPlugin,
    TagsFilePlugin,
    PostGraphileNestedMutations,
    ExtendPlugin,
    WrapPlugin
  ],
  handleErrors,
  additionalGraphQLContextFromRequest: async (req: Request, res: Response) => {
    const dbPool = getDbPool();

    return {
      user: req.user,
      logger: req.logger,
      pubSub: req.pubSub,
      pgRootPool: dbPool
    };
  },
  pgSettings: async ({ user }: Props) => {
    let role = user?.role;
    if (!availableRoles.includes(user?.role)) {
      role = "INSTALLER";
    }

    return {
      "app.current_account_id": user?.id,
      "app.current_account_email": user?.email,
      role: role.toLocaleLowerCase()
    };
  }
};

export default postGraphileOpts;
