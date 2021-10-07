import { Request } from "express";
import { Account } from "@bmi/intouch-api-types";
import { getMarketAndEnvFromReq } from "../../lib/utils";

export const marketRedirect = (req: Request, account: Account) => {
  const { market, currentHost } = getMarketAndEnvFromReq(req);

  if (account.role === "SUPER_ADMIN") {
    return null;
  }

  const protocol = req?.headers["x-forwarded-proto"] || "http";

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
