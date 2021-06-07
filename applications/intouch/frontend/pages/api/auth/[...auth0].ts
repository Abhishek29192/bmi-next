import { NextApiRequest, NextApiResponse } from "next";
import { getAuth0Instance } from "../../../lib/auth0";
import { createAccount, createDoceboUser } from "../../../lib/account";
import { REDIRECT_MAP } from "../../../lib/config";
import { withLoggerApi } from "../../../lib/logger/withLogger";

interface Request extends NextApiRequest {
  logger: any;
}

const afterCallback = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session,
  state
) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const intouch_invitation = user[`${AUTH0_NAMESPACE}/intouch_invitation`];
  const intouch_user_id = user[`${AUTH0_NAMESPACE}/intouch_user_id`];
  const intouch_docebo_id = user[`${AUTH0_NAMESPACE}/intouch_docebo_id`];

  // To avoid redirect loop we do not create any user if coming from /api/silent-login (prompt=none)
  if (!intouch_invitation && !intouch_user_id && state.prompt !== "none") {
    const { data: { createAccount: account = null } = {} } =
      (await createAccount(req, session)) || {};

    await createDoceboUser(req, session, account?.id);
    state.returnTo = "/api/silent-login";
    return session;
  }
  if (!intouch_docebo_id && state.prompt !== "none") {
    await createDoceboUser(req, session);
  }

  return session;
};

export default withLoggerApi(async (req: Request, res: NextApiResponse) => {
  const auth0 = await getAuth0Instance(req, res);

  const logger = req.logger("Auth0");

  const {
    handleAuth,
    handleLogin,
    handleCallback,
    handleProfile,
    handleLogout
  } = auth0;

  return handleAuth({
    async login(req, res) {
      let { host } = req.headers;

      let market = REDIRECT_MAP[host];

      // localhost
      if (host.indexOf(":") !== -1) {
        host = host.split(":")[0];
        if (host === "localhost") {
          market = REDIRECT_MAP[host] || "en";
        }
      }

      try {
        await handleLogin(req, res, {
          authorizationParams: {
            market
          },
          returnTo: req.query.returnTo || "/"
        });
      } catch (error) {
        logger.error(`handle login: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    },
    async callback(req, res) {
      try {
        logger.info("Callback");
        await handleCallback(req, res, { afterCallback });
      } catch (error) {
        logger.error(`handle callback: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    },
    async profile(req, res) {
      try {
        logger.info("Handle profile");
        await handleProfile(req, res, {
          refetch: true
        });
      } catch (error) {
        logger.error(`handle profile: ${error.message}`);
        const status = error.message === "invalid_token" ? 401 : error.status;
        return res.status(status || 500).end(error.message);
      }
    },
    async logout(req, res) {
      try {
        logger.info("Logout");
        await handleLogout(req, res);
      } catch (error) {
        logger.error(`handle logout: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    }
  })(req, res);
});
