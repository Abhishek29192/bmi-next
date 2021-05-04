import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import auth0 from "../../lib/auth0";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  if (!req.headers.authorization) {
    try {
      const session = await auth0.getSession(req, res);
      req.headers.authorization = `Bearer ${session.accessToken}`;
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
};

export default handler;
