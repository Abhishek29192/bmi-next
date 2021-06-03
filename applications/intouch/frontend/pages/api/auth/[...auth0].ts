import { NextApiRequest, NextApiResponse } from "next";
import { getAuth0Instance } from "../../../lib/auth0";
import {
  createAccount,
  createDoceboUser,
  updateAccount
} from "../../../lib/account";
import { REDIRECT_MAP } from "../../../lib/config";
import { withLoggerApi } from "../../../lib/logger/withLogger";

interface Request extends NextApiRequest {
  logger: any;
}

const afterCallback = async (
  req: Request,
  res: NextApiResponse,
  session,
  state
) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const intouch_user_id = user[`${AUTH0_NAMESPACE}/intouch_user_id`];
  const intouch_docebo_id = user[`${AUTH0_NAMESPACE}/intouch_docebo_id`];

  // To avoid redirect loop we do not create any user if coming from /api/silent-login (prompt=none)
  if (!intouch_user_id && state.prompt !== "none") {
    await createAccount(req, session);
    state.returnTo = "/api/silent-login";
  }

  if (intouch_user_id && !intouch_docebo_id) {
    const {
      data: {
        createDoceboUser: { user_id }
      }
    } = await createDoceboUser(req, session);

    await updateAccount(req, session, intouch_user_id, user_id);
    state.returnTo = "/api/silent-login";
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

      if (host.indexOf(":") !== -1) {
        host = host.split(":")[0];
      }

      try {
        await handleLogin(req, res, {
          authorizationParams: {
            market: REDIRECT_MAP[host]
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        logger.error(`handle login: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    },
    async callback(req, res) {
      try {
        await handleCallback(req, res, { afterCallback });
      } catch (error) {
        // eslint-disable-next-line no-console
        logger.error(`handle callback: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    },
    async profile(req, res) {
      try {
        await handleProfile(req, res, {
          refetch: true
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        logger.error(`handle profile: ${error.message}`);
        const status = error.message === "invalid_token" ? 401 : error.status;
        return res.status(status || 500).end(error.message);
      }
    },
    async logout(req, res) {
      try {
        await handleLogout(req, res);
      } catch (error) {
        // eslint-disable-next-line no-console
        logger.error(`handle logout: ${error.message}`);
        return res.status(error.status || 500).end(error.message);
      }
    }
  })(req, res);
});
