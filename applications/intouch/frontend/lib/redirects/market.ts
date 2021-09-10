import { Request } from "express";
import { Account } from "@bmi/intouch-api-types";
import { redirectMapInverse } from "../config/redirects";
import { ROLES } from "../../lib/constants";

const DEFAULT_REDIRECT_DOMAIN = "en";

export const getReturnToUrl = (
  protocol: string,
  domain: string,
  port?: string
) => {
  let returnToUrl = `${protocol}://${redirectMapInverse[`${domain}`]}`;
  if (port) {
    returnToUrl = `${returnToUrl}:${port}`;
  }
  return returnToUrl;
};

export const marketRedirect = (req: Request, account: Account) => {
  const { AUTH0_COOKIE_DOMAIN } = process.env;

  // for multi-market & redirects set the domain to local.intouch (see README)
  if (AUTH0_COOKIE_DOMAIN === "localhost") {
    return null;
  }
  const [host, port] = req.headers.host.split(":");
  const [code] = host.replace(AUTH0_COOKIE_DOMAIN, "").split(".");
  const protocol = (req.headers["x-forwarded-proto"] || "http") as string;

  // Super Admins do not have a market
  if (account.role === ROLES.SUPER_ADMIN) {
    return code
      ? // They shouldn't need to be re-directed
        null
      : // unless there is no sub-domain in the URL.
        {
          redirect: {
            permanent: false,
            // In that case we re-direct them to a default sub-domain
            destination: getReturnToUrl(protocol, DEFAULT_REDIRECT_DOMAIN, port)
          }
        };
  }

  const {
    market: { domain }
  } = account;

  if (domain && domain !== code) {
    return {
      redirect: {
        permanent: false,
        destination: getReturnToUrl(protocol, domain, port)
      }
    };
  }

  return null;
};
