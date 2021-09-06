import { Buffer } from "buffer";
import camelcaseKeys from "camelcase-keys";
import { getDbPool } from "../db";
import { Account } from "../types";
import rolePermissions from "../permissions";

export const parseHeaders = (req): Account => {
  const logger = req.logger("userInfo");
  const userInfo = req.headers["x-apigateway-api-userinfo"];
  if (userInfo) {
    try {
      return JSON.parse(
        Buffer.from(userInfo as string, "base64").toString("ascii")
      );
    } catch (error) {
      logger.error("Errore parsing the userinfo header: ", error);
    }
  }
};

export const can = (req) => (permissions: string | string[]) => {
  const toCheck = Array.isArray(permissions) ? permissions : [permissions];
  const currentPermissions = rolePermissions[req.user.role];

  return !!currentPermissions.some((r) => toCheck.includes(r));
};

export default async (req, res, next) => {
  const user = parseHeaders(req);
  const dbPool = getDbPool();

  if (user) {
    req.user = {
      email: user[`${process.env.AUTH0_NAMESPACE}/email`],
      iss: user.iss,
      iat: user.iat,
      exp: user.exp,
      scope: user.exp,
      sub: user.sub,
      aud: user.aud
    };

    const { rows: users } = await dbPool.query(
      "SELECT account.*, market.domain, market.send_mailbox FROM account JOIN market on account.market_id = market.id WHERE email = $1",
      [req.user.email]
    );

    if (users.length) {
      req.user = {
        ...req.user,
        id: users[0].id,
        role: users[0].role,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        status: users[0].status,
        doceboUserId: users[0].docebo_user_id,
        doceboUsername: users[0].docebo_username,
        migrationId: users[0].migration_id,
        marketId: users[0].market_id,
        market: camelcaseKeys({
          id: users[0].market_id,
          domain: users[0].domain,
          send_mailbox: users[0].send_mailbox
        })
      };
    }

    const { rows: companies } = await dbPool.query(
      "SELECT company.* FROM company JOIN company_member ON company_member.company_id = company.id WHERE company_member.account_id = $1",
      [req.user.id]
    );

    if (companies.length) {
      req.user = {
        ...req.user,
        company: camelcaseKeys(companies[0])
      };
    }

    req.user.can = can(req);
  }

  return next();
};
