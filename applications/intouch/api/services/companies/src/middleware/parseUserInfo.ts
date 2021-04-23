import { Buffer } from "buffer";

const NAMESPACE = "https://intouch";

export default (req, res, next) => {
  let user = {};
  if (req.headers["x-apigateway-api-userinfo"]) {
    user = JSON.parse(
      Buffer.from(
        req.headers["x-apigateway-api-userinfo"] as string,
        "base64"
      ).toString("ascii")
    );
  }

  req.user = {
    id: user[`${NAMESPACE}/intouch_user_id`],
    role: user[`${NAMESPACE}/intouch_role`],
    email: user[`${NAMESPACE}/email`],
    // Just to have a copy of the auth0 parsed user
    auth0: {
      ...user
    }
  };

  return next();
};
