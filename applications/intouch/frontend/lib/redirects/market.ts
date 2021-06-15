import { REDIRECT_MAP } from "../config";
import { parseAccount } from "../account";

export const marketRedirect = (req, res, user = {}) => {
  const { AUTH0_COOKIE_DOMAIN } = process.env;

  if (AUTH0_COOKIE_DOMAIN === "localhost") {
    return;
  }

  const [host, port] = req.headers.host.split(":");
  const [code] = host.split(".");
  const protocol = req.headers["x-forwarded-proto"] || "http";

  const { marketCode } = parseAccount(user);

  const redirectMapInverse = {};
  Object.keys(REDIRECT_MAP).forEach((key) => {
    redirectMapInverse[REDIRECT_MAP[key]] = key;
  });

  if (marketCode && marketCode !== code) {
    let returnTo = `${protocol}://${redirectMapInverse[marketCode]}`;
    if (port) {
      returnTo = `${returnTo}:${port}`;
    }

    res.writeHead(302, {
      Location: returnTo
    });
    return res.end();
  }
};
