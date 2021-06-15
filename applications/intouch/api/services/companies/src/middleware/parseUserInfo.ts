import { Buffer } from "buffer";
import { getDbPool } from "../db";
import { Account } from "../types";

const { AUTH0_NAMESPACE } = process.env;

export const parseHeaders = (req): Account => {
  if (req.headers["x-apigateway-api-userinfo"]) {
    return JSON.parse(
      Buffer.from(
        req.headers["x-apigateway-api-userinfo"] as string,
        "base64"
      ).toString("ascii")
    );
  }
  return null;
};

export default async (req, res, next) => {
  const user = parseHeaders(req);
  const dbPool = getDbPool();

  if (user) {
    req.user = {
      intouchUserId: user[`${AUTH0_NAMESPACE}/intouch_user_id`],
      email: user[`${AUTH0_NAMESPACE}/email`],
      role: user[`${AUTH0_NAMESPACE}/intouch_role`],
      lastName: user[`${AUTH0_NAMESPACE}/last_name`],
      firstName: user[`${AUTH0_NAMESPACE}/first_name`],
      invited: user[`${AUTH0_NAMESPACE}/intouch_invited`],
      doceboId: user[`${AUTH0_NAMESPACE}/intouch_docebo_id`],
      registrationType: user[`${AUTH0_NAMESPACE}/registration_type`],
      marketcode: user[`${AUTH0_NAMESPACE}/intouch_market_code`],
      registrationToComplete:
        user[`${AUTH0_NAMESPACE}/registration_to_complete`],
      iss: user.iss,
      iat: user.iat,
      exp: user.exp,
      scope: user.exp,
      sub: user.sub,
      aud: user.aud
    };

    const { rows: users } = await dbPool.query(
      "SELECT * FROM account WHERE id = $1",
      [req.user.intouchUserId]
    );

    if (users.length) {
      req.user = {
        ...req.user,
        marketId: users[0].market_id,
        status: users[0].status,
        doceboUserId: users[0].docebo_user_id,
        doceboUsername: users[0].docebo_username,
        migrationId: users[0].migration_id
      };
    }

    const { rows: company_members } = await dbPool.query(
      "SELECT company_id FROM company_member WHERE account_id = $1",
      [req.user.intouchUserId]
    );

    if (company_members.length) {
      req.user = {
        ...req.user,
        companyId: company_members[0].company_id
      };
    }
  }

  return next();
};
