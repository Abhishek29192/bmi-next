import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

const { AUTH0_AUDIENCE, AUTH0_DOMAIN, NODE_ENV } = process.env;

const isDev = NODE_ENV === "development";

const isIntrospectionInDev = ({ method, body }) => {
  if (isDev && method === "POST" && body.operationName === "IntrospectionQuery")
    return true;
};

const isPlayground = ({ url }) => {
  if (url === "/playground") return true;
};

const isOptionCors = ({ method }) => {
  if (method === "OPTIONS") return true;
};

const checkJwt = (req, res, next) => {
  if (isOptionCors(req) || isIntrospectionInDev(req) || isPlayground(req)) {
    return next();
  }

  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: AUTH0_AUDIENCE,
    issuer: `https://${AUTH0_DOMAIN}/`,
    algorithms: ["RS256"]
  })(req, res, next);
};
export default checkJwt;
