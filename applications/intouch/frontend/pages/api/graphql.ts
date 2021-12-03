import { Buffer } from "buffer";
import { v4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { getAuth0Instance } from "../../lib/auth0";
import { getMarketAndEnvFromReq } from "../../lib/utils";
import { withLoggerApi } from "../../lib/middleware/withLogger";

interface ExtendedNextApiRequest extends NextApiRequest {
  logger: any;
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

const { GRAPHQL_URL, NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";
const isLocalGateway =
  GRAPHQL_URL?.indexOf("local") !== -1 ||
  GRAPHQL_URL?.indexOf("127.0.0.1") !== -1;

const proxyOptions: Options = {
  headers: {
    ...(!isDev && {
      Connection: "keep-alive"
    })
  },
  changeOrigin: true,
  proxyTimeout: isDev ? 5000 : 3000,
  secure: false,
  pathRewrite: {
    "^/api/graphql": ""
  },
  xfwd: true,
  logLevel: "error",
  onError: (error) => {
    // eslint-disable-next-line no-console
    console.log("Error proxying the request: ", error.message);
  }
};

const graphqlAuth0Proxy = createProxyMiddleware({
  target: `${GRAPHQL_URL}/graphql`,
  ...proxyOptions
});

const graphqlApiProxy = createProxyMiddleware({
  target: `${GRAPHQL_URL}/graphql_api`,
  ...proxyOptions
});

const nextFn = (error) => {
  if (error) {
    // eslint-disable-next-line
    console.log(
      "Error proxying the request in the next function: ",
      error.message
    );

    throw error;
  }
};

export const handler = async function (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let user;
  let market;

  const { headers } = req;

  const logger = req.logger("graphql");

  // In this case I'm doing client side request so I need to check the session
  if (!req.headers.authorization) {
    const auth0 = await getAuth0Instance(req, res);
    const session = await auth0.getSession(req, res);

    console.log("session", session);

    let accessToken = session?.accessToken;

    if (Date.now() >= session?.accessTokenExpiresAt * 1000) {
      const newAccessToken = await auth0.getAccessToken(req, res, {
        refresh: true
      });
      console.log("handler: refreshing access token", newAccessToken);
      console.log(
        "handler: refreshing access token",
        newAccessToken.accessToken
      );

      accessToken = newAccessToken?.accessToken;
    }

    try {
      req.headers.authorization = `Bearer ${accessToken}`;
      user = session.user;
    } catch (error) {
      // Log only if not using api key otherwise we will get tons of useless errors
      if (!headers["x-api-key"]) {
        logger.error(error);
      }
    }
  } else {
    const userInfo = req.headers.authorization?.split(".")[1];

    try {
      user = JSON.parse(Buffer.from(userInfo, "base64").toString());
    } catch (error) {
      if (!headers["x-api-key"]) {
        logger.error(error);
      }
    }
  }

  // The redirect middleware run before everything so it should never happen to
  // arrive at this point without a subdomain
  const { host } = req.headers;
  const { FRONTEND_BASE_URL } = process.env;

  if ([`http://${host}`, `https://${host}`].includes(FRONTEND_BASE_URL)) {
    market = user?.["https://intouch/intouch_market_code"];
  } else {
    market = getMarketAndEnvFromReq(req as any).market;
  }

  /**
   * If we are working locally we are not able to use the gcp api-gateway
   * so we need to replicate it sending the paylod base64.
   * The api gateway will always re-write this header so if we try to send this header
   * to the api gateay it will be overwritten
   * We also need to simulate the api key somehow
   */

  if (isDev) {
    const authHeader = headers.authorization;

    if (authHeader) {
      const jwtPayloads = authHeader.split(".");

      if (jwtPayloads.length > 1) {
        headers["x-apigateway-api-userinfo"] = jwtPayloads[1];
      }
    }
  }

  req.headers["x-request-market-domain"] = market || "en";

  if (!req.headers["x-request-id"]) req.headers["x-request-id"] = v4();

  // Nextjs req/res object are different then the express req/response objects
  // createProxyMiddleware accept only express req/res object so we need to convert
  // the nextjs req/res to any
  if (headers["x-api-key"] && !isLocalGateway) {
    graphqlApiProxy(req as any, res as any, nextFn);
  } else {
    graphqlAuth0Proxy(req as any, res as any, nextFn);
  }
};

export default withLoggerApi(handler);
