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

const handler = async function (req: Request, res: NextApiResponse, next: any) {
  const { GRAPHQL_URL } = process.env;
  const logger = req.logger("graphql");

  if (!req.headers.authorization) {
    try {
      const auth0 = await getAuth0Instance(req, res);
      const session = await auth0.getAccessToken(req, res, { refresh: true });
      req.headers.authorization = `Bearer ${session.accessToken}`;
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error);
    }
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

  createProxyMiddleware({
    target: GRAPHQL_URL,
    proxyTimeout: 5000,
    secure: false,
    headers: {
      Connection: "keep-alive"
    },
    pathRewrite: {
      "^/api/graphql": ""
    },
    xfwd: true,
    logLevel: "error"
  })(req as any, res as any, next);
};

export default withLoggerApi(handler);
