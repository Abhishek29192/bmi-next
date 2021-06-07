import { Buffer } from "buffer";
import { getDbPool } from "../db";

const NAMESPACE = "https://intouch";

export const parseHeaders = (req): User => {
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
      id: user[`${NAMESPACE}/intouch_user_id`],
      role: user[`${NAMESPACE}/intouch_role`],
      email: user[`${NAMESPACE}/email`],
      iss: user.iss,
      iat: user.iat,
      exp: user.exp,
      scope: user.exp,
      sub: user.sub,
      aud: user.aud
    };

    const { rows: users } = await dbPool.query(
      "SELECT * FROM account WHERE id = $1",
      [req.user.id]
    );

    if (users.length) {
      req.user = {
        ...req.user,
        market_id: users[0].market_id,
        status: users[0].status,
        docebo_user_id: users[0].docebo_user_id,
        docebo_username: users[0].docebo_username,
        migration_id: users[0].migration_id
      };
    }

    const { rows: company_members } = await dbPool.query(
      "SELECT company_id FROM company_member WHERE account_id = $1",
      [req.user.id]
    );

    if (company_members.length) {
      req.user = {
        ...req.user,
        company_id: company_members[0].company_id
      };
    }
  }

  console.log("req.user", req.user);

  return next();
};
