import { REDIRECT_MAP } from "../config";

export const marketRedirect = (req, res, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const [host] = req.headers.host.split(":");
  const [code] = host.split(".");
  const intouch_market_code = user[`${AUTH0_NAMESPACE}/intouch_market_code`];

  if (host.indexOf("localhost") !== -1) {
    return;
  }

  const REDIRECT_MAP_INVERSE = {};
  Object.keys(REDIRECT_MAP).forEach((key) => {
    REDIRECT_MAP_INVERSE[REDIRECT_MAP[key]] = key;
  });

  if (!intouch_market_code) {
    throw new Error("missing_market");
  }

  if (intouch_market_code !== code) {
    // TODO use the right domain
    res.writeHead(302, {
      Location: `http://${REDIRECT_MAP_INVERSE[intouch_market_code]}:3000`
    });
    res.end();
    return;
  }
};
