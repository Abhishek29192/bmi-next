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

    const { rows } = await dbPool.query(
      "SELECT company_id FROM company_member WHERE account_id = $1",
      [req.user.id]
    );

    if (rows.length) {
      req.user = {
        ...req.user,
        company_id: rows[0].company_id
      };
    }
  }

  console.log("req.user", req.user);

  return next();
};
