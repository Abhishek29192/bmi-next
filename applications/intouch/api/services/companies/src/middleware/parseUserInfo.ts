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
  const logger = req.logger("userInfo");
  const user = parseHeaders(req);
  const dbPool = getDbPool();

  if (user) {
    if (
      [
        "pdf-generator-function",
        "incomplete-reminder-function",
        "archive-guarantee-function",
        "certification-function",
        "annual-inspection-function"
      ].includes(user?.source)
    ) {
      // if we want to limit access per function/service
      req.trustedConnection = true;
      req.user = {
        source: user?.source,
        role: "SUPER_ADMIN"
      };

      logger.info(`[req from parseUserInfo] is: ${req?.user?.role}`, req);

      if (req.headers["x-request-market-domain"]) {
        const {
          rows: [market]
        } = await dbPool.query(
          "SELECT id, domain, send_mailbox FROM market where domain = $1",
          [req.headers["x-request-market-domain"]]
        );

        req.user = {
          ...req.user,
          marketId: market?.id,
          market: camelcaseKeys({
            id: market?.id,
            domain: market?.domain,
            send_mailbox: market?.send_mailbox
          })
        };
      }
    } else {
      req.user = {
        email: user[`${process.env.AUTH0_NAMESPACE}/email`],
        ...user
      };

      const {
        rows: [account]
      } = await dbPool.query("SELECT * FROM account WHERE email = $1", [
        req.user.email
      ]);

      if (account) {
        const {
          rows: [market]
        } = await dbPool.query(
          "SELECT id, domain, send_mailbox FROM market where domain = $1",
          [req.headers["x-request-market-domain"]]
        );

        req.user = {
          ...req.user,
          id: account.id,
          role: account.role,
          firstName: account.first_name,
          lastName: account.last_name,
          status: account.status,
          doceboUserId: account.docebo_user_id,
          doceboUsername: account.docebo_username,
          migrationId: account.migration_id,
          marketId: market?.id,
          market: camelcaseKeys({
            id: market?.id,
            domain: market?.domain,
            send_mailbox: market?.send_mailbox
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
    }

    req.user.can = can(req);
  }

  return next();
};
