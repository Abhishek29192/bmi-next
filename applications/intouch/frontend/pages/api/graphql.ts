import { Buffer } from "buffer";
import { v4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getAuth0Instance } from "../../lib/auth0";
import { withLoggerApi } from "../../lib/middleware/withLogger";

interface Request extends NextApiRequest {
  logger: any;
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export const handler = async function (
  req: Request,
  res: NextApiResponse,
  next: any
) {
  const { GRAPHQL_URL } = process.env;
  const logger = req.logger("graphql");

  let user;

  // In this case I'm doing client side request so I need to check the session
  if (!req.headers.authorization) {
    const auth0 = await getAuth0Instance(req, res);
    const session = await auth0.getSession(req, res);

    try {
      req.headers.authorization = `Bearer ${session.accessToken}`;
      user = session.user;
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error);
    }
  } else {
    const userInfo = req.headers.authorization?.split(".")[1];

    try {
      user = JSON.parse(Buffer.from(userInfo, "base64").toString());
    } catch (error) {
      logger.error(error);
    }
  }

  // The redirect middleware run before everything so it should never happen to
  // arrive at this point without a subdomain
  let market;

  const { host } = req.headers;
  const { FRONTEND_BASE_URL } = process.env;

  if ([`http://${host}`, `https://${host}`].includes(FRONTEND_BASE_URL)) {
    market = user?.["https://intouch/intouch_market_code"];
  } else {
    market = req.headers.host?.split(".")[0];
  }

  /**
   * If we are working locally we are not able to use the gcp api-gateway
   * so we need to replicate it sending the paylod base64.
   * The api gateway will always re-write this header so if we try to send this header
   * to the api gateay it will be overwritten
   */

  if (process.env.NODE_ENV === "development") {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [, jwtPayload] = authHeader.split(".");
      req.headers["x-apigateway-api-userinfo"] = jwtPayload;
    }
  }

  req.headers["x-request-market-domain"] = market || "en";

  if (!req.headers["x-request-id"]) req.headers["x-request-id"] = v4();

  createProxyMiddleware({
    target: GRAPHQL_URL,
    changeOrigin: true,
    proxyTimeout: process.env.NODE_ENV === "development" ? 10000 : 3000,
    secure: false,
    pathRewrite: {
      "^/api/graphql": ""
    },
    xfwd: true,
    logLevel: "error",
    onError: (error) => {
      logger.error("Error proxying the request: ", error);
    }
  })(req as any, res as any, (error) => {
    logger.error("Error proxying the request in the next function: ", error);

    return next;
  });
};

export default withLoggerApi(handler);
