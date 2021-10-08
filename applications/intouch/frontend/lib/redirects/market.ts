import { Request } from "express";
import { Account } from "@bmi/intouch-api-types";
import { getMarketAndEnvFromReq } from "../../lib/utils";

export const marketRedirect = (req: Request, account: Account) => {
  const protocol = req?.headers["x-forwarded-proto"] || "http";
  const { market, currentHost } = getMarketAndEnvFromReq(req);
  const defaultMarket = "no";

  // If the market is local or intouch means that the url is something like:
  // local.intouch:3000 or intouch.bmigroup.com and the market is not in the url
  // in this case we use a default market, in this case the no market
  if (["intouch", "local"].includes(market)) {
    return {
      redirect: {
        permanent: false,
        destination: `${protocol}://${currentHost.replace(
          market,
          `${defaultMarket}.${market}`
        )}`
      }
    };
  }

  // If the user is a super admin he doesn't have any market so he need to be
  // able to navigate any market
  if (account.role === "SUPER_ADMIN") {
    return null;
  }

  if (market !== account.market.domain) {
    return {
      redirect: {
        permanent: false,
        destination: `${protocol}://${currentHost.replace(
          market,
          account.market.domain
        )}`
      }
    };
  }

  return null;
};
