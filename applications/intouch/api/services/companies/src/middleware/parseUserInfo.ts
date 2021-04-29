import { Buffer } from "buffer";

const { NODE_ENV } = process.env;
const NAMESPACE = "https://intouch";
const INTROSPECTION =
  "query __ApolloGetServiceDefinition__ { _service { sdl } }";

export const parseHeaders = (req): User => {
  if (req.headers["x-apigateway-api-userinfo"]) {
    return JSON.parse(
      Buffer.from(
        req.headers["x-apigateway-api-userinfo"] as string,
        "base64"
      ).toString("ascii")
    );
  }
  return null;
};

export const isIntrospactionInDev = ({ body }) => {
  if (NODE_ENV === "development" && body.query === INTROSPECTION) {
    return true;
  }
  return false;
};

export default (req, res, next) => {
  // Skip authentication is in dev and introspection query
  if (isIntrospactionInDev(req)) {
    return next();
  }

  const user = parseHeaders(req);

  if (user) {
    req.user = {
      id: user[`${NAMESPACE}/intouch_user_id`],
      role: user[`${NAMESPACE}/intouch_role`],
      email: user[`${NAMESPACE}/email`],
      iss: user.iss,
      iat: user.iat,
      exp: user.exp,
      scope: user.exp,
      sub: user.sub,
      aud: user.aud
    };
  }

  return next();
};
