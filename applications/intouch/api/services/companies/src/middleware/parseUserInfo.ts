import { Buffer } from "buffer";

const NAMESPACE = "https://intouch";

export default (req, res, next) => {
  let user: User;
  let isValidAud = false;
  if (req.headers["x-apigateway-api-userinfo"]) {
    user = JSON.parse(
      Buffer.from(
        req.headers["x-apigateway-api-userinfo"] as string,
        "base64"
      ).toString("ascii")
    );
  }

  if (Array.isArray(user.aud)) {
    if (!user.aud.includes(process.env.SERVICE_AUDIENCE)) {
      isValidAud = true;
    }
  } else {
    if (user.aud === process.env.SERVICE_AUDIENCE) {
      isValidAud = true;
    }
  }

  if (!isValidAud) {
    throw new Error("invalid_audience");
  }

  req.user = {
    id: user[`${NAMESPACE}/intouch_user_id`],
    role: user[`${NAMESPACE}/intouch_role`],
    email: user[`${NAMESPACE}/email`],
    iss: user.iss,
    iat: user.iat,
    exp: user.exp,
    scope: user.exp,
    aud: user.aud,
    sub: user.sub
  };

  return next();
};
