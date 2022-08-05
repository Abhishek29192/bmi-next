import axios from "axios";
import { NextFunction } from "express";
import { getGCPToken } from "../utils";

export const overwriteMarketHeader = (req) => {
  const { user = null } = req;
  const marketClaim = `${process.env.AUTH0_NAMESPACE}/intouch_market_code`;
  const logger = req.logger("gateway:client");

  logger.info(`[user] is: ${user?.role}`, user);

  if (
    user?.role !== "SUPER_ADMIN" &&
    user?.[`${marketClaim}`] &&
    !user?.market?.domain
  ) {
    return user[`${marketClaim}`];
  }

  return req.headers["x-request-market-domain"];
};

export default (req, res, next: NextFunction) => {
  const logger = req.logger("gateway:client");

  /* 
    In Auth0 we can't use a dynamic redirect_to url that contains the
    user market, so we are redirecting the use to a default market (`no`).
    The first time the user login will be in the defulat market insted of his
    real market, he will not have a `req?.user?.market?.domain` becuase it is not
    in our db yet, in thic case we overwrite the `x-request-market-domain` to match
    the user market in order fetch everything from the right market (email included).

    Super Admin doesn't have a market so for him we skip this overwrite
   */
  req.headers["x-request-market-domain"] = overwriteMarketHeader(req);

  req.clientGateway = async (
    query: string,
    variables: Record<string, unknown>
  ) => {
    const { GATEWAY_URL } = process.env;
    const bearer = await getGCPToken(GATEWAY_URL);

    logger.info(
      `[x-request-market-domain] is: ${req.headers["x-request-market-domain"]}`,
      req.headers
    );

    try {
      const { data } = await axios({
        url: `${GATEWAY_URL}`,
        method: "POST",
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json",
          "x-request-market-domain": req.headers[
            "x-request-market-domain"
          ] as string,
          "x-apigateway-api-userinfo": req.headers["x-apigateway-api-userinfo"]
        },
        data: { query, variables },
        timeout: 3000
      });

      return data;
    } catch (error) {
      logger.error("Error fetching gateway: ", error);
      throw new Error(error);
    }
  };

  return next();
};
