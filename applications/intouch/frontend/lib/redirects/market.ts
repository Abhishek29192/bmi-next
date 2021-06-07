import { REDIRECT_MAP } from "../config";

export const marketRedirect = (req, res, user = {}) => {
  const { AUTH0_NAMESPACE, AUTH0_COOKIE_DOMAIN, NODE_ENV } = process.env;

  if (AUTH0_COOKIE_DOMAIN === "localhost") {
    return;
  }

  const [host, port] = req.headers.host.split(":");
  const [code] = host.split(".");
  const protocol = req.headers["x-forwarded-proto"] || "http";

  const intouch_market_code = user[`${AUTH0_NAMESPACE}/intouch_market_code`];

  const redirectMapInverse = {};
  Object.keys(REDIRECT_MAP).forEach((key) => {
    redirectMapInverse[REDIRECT_MAP[key]] = key;
  });

  if (intouch_market_code && intouch_market_code !== code) {
    let returnTo = `${protocol}://${redirectMapInverse[intouch_market_code]}`;
    if (port) {
      returnTo = `${returnTo}:${port}`;
    }

    res.writeHead(302, {
      Location: returnTo
    });
    return res.end();
  }
};
