import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

const { AUTH0_AUDIENCE, AUTH0_DOMAIN } = process.env;

const checkJwt = (req, res, next) => {
  const { method } = req;

  // Skip options requests
  if (method === "OPTIONS") return next();

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
