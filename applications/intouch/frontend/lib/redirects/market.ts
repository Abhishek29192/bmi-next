import { Request } from "express";
import { Account } from "@bmi/intouch-api-types";
import { REDIRECT_MAP } from "../config";

export const marketRedirect = (req: Request, account: Account) => {
  const { AUTH0_COOKIE_DOMAIN } = process.env;

  // for multi-market & redirects set the domain to local.intouch (see README)
  if (AUTH0_COOKIE_DOMAIN === "localhost") {
    return null;
  }

  const [host, port] = req.headers.host.split(":");
  const [code] = host.split(".");
  const protocol = req.headers["x-forwarded-proto"] || "http";

  const {
    market: { domain }
  } = account;

  const redirectMapInverse = {};
  Object.keys(REDIRECT_MAP).forEach((key) => {
    redirectMapInverse[`${REDIRECT_MAP[`${key}`]}`] = key;
  });

  if (domain && domain !== code) {
    let returnTo = `${protocol}://${redirectMapInverse[`${domain}`]}`;
    if (port) {
      returnTo = `${returnTo}:${port}`;
    }

    return {
      redirect: {
        permanent: false,
        destination: returnTo
      }
    };
  }

  return null;
};
