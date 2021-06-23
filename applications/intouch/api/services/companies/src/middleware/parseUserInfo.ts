import { Buffer } from "buffer";
import { getDbPool } from "../db";
import { Account } from "../types";

const { AUTH0_NAMESPACE } = process.env;

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

export default async (req, res, next) => {
  const user = parseHeaders(req);
  const dbPool = getDbPool();

  if (user) {
    req.user = {
      email: user[`${AUTH0_NAMESPACE}/email`],
      iss: user.iss,
      iat: user.iat,
      exp: user.exp,
      scope: user.exp,
      sub: user.sub,
      aud: user.aud
    };

    const { rows: users } = await dbPool.query(
      "SELECT account.*, market.domain FROM account JOIN market on account.market_id = market.id WHERE email = $1",
      [req.user.email]
    );

    if (users.length) {
      req.user = {
        ...req.user,
        id: users[0].id,
        role: users[0].role,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        marketId: users[0].market_id,
        marketCode: users[0].market_domain,
        status: users[0].status,
        doceboUserId: users[0].docebo_user_id,
        doceboUsername: users[0].docebo_username,
        migrationId: users[0].migration_id
      };
    }

    const { rows: company_members } = await dbPool.query(
      "SELECT * FROM company_member WHERE account_id = $1",
      [req.user.id]
    );

    if (company_members.length) {
      const { rows: companies } = await dbPool.query(
        "SELECT * FROM company WHERE id = $1",
        [company_members[0].company_id]
      );
      req.user = {
        ...req.user,
        company: companies[0]
      };
    }
  }

  return next();
};
