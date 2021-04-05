import { createProxyMiddleware } from "http-proxy-middleware";
import nextConnect from "next-connect";
import auth0 from "../../lib/auth0";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

const proxyOptions = {
  target: process.env.GRAPHQL_URL,
  changeOrigin: true,
  proxyTimeout: 5000,
  secure: false,
  headers: {
    Connection: "keep-alive"
  },
  pathRewrite: {
    "^/api/graphql": ""
  }
};

const handler = nextConnect();

handler.use(async (req, res, next) => {
  const session = await auth0.getSession(req, res);
  if (session) {
    req.headers.authorization = `Bearer ${session.accessToken}`;
  }
  return next();
});
handler.use(createProxyMiddleware(proxyOptions));

export default handler;
