import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import auth0 from "../../lib/auth0";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  if (!req.headers.authorization) {
    try {
      const tokenPayload = await auth0.getAccessToken(req, res, {
        refresh: true
      });
      req.headers.authorization = `Bearer ${tokenPayload.accessToken}`;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error: ", error);
    }
  }

  createProxyMiddleware({
    target: process.env.GRAPHQL_URL,
    changeOrigin: true,
    proxyTimeout: 5000,
    secure: false,
    headers: {
      Connection: "keep-alive"
    },
    pathRewrite: {
      "^/api/graphql": ""
    },
    xfwd: true,
    logLevel: "debug"
  })(req as any, res as any, next);
}
