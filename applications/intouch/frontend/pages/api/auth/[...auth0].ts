import {
  handleAuth,
  handleLogin,
  handleCallback,
  handleProfile,
  handleLogout
} from "@auth0/nextjs-auth0";
import { createAccount } from "../../../lib/account";

const afterCallback = async (req, res, session, state) => {
  const { user } = session;

  const intouch_user_id =
    user[`${process.env.AUTH0_NAMESPACE}/intouch_user_id`];

  // To avoid redirect loop we do not create any user if coming from /api/silenth-auth (prompt=none)
  if (!intouch_user_id && state.prompt !== "none") {
    await createAccount(session);

    return res.writeHead(302, { Location: "/api/silent-auth" }).end();
  }

  return session;
};

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          market: req.query.market || "en"
        }
      });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
  async profile(req, res) {
    try {
      await handleProfile(req, res, {
        refetch: true
      });
    } catch (error) {
      const status = error.message === "invalid_token" ? 401 : error.status;
      res.status(status || 500).end(error.message);
    }
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res);
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
});
