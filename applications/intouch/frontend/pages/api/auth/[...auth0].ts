import { v4 } from "uuid";
import { Session } from "@auth0/nextjs-auth0";
import { NextLogger } from "@bmi-digital/logger";

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth0Instance } from "../../../lib/auth0";
import { initializeApollo } from "../../../lib/apolloClient";
import Account from "../../../lib/account";
import { getMarketAndEnvFromReq } from "../../../lib/utils";
import { withLoggerApi } from "../../../lib/middleware/withLogger";

interface Request extends NextApiRequest {
  logger: any;
}

export const afterCallback = async (
  req: Request,
  res: NextApiResponse,
  session: Session,
  state
) => {
  req.headers["x-authenticated-user-id"] = session?.user?.sub;

  // Set the logger again with the session attached
  NextLogger(req, res);

  const apolloClient = await initializeApollo(null, { res, req, session });

  const accountSrv = new Account(req.logger, apolloClient, session);

  // Fetch the account
  let account = await accountSrv.getAccount(session);

  // If the user has a valid invitation return the session as the return url
  // in the reset password email will redirect him to /api/invitation
  if (!account?.id) {
    const invitation = await accountSrv.getInvitation(session);
    if (invitation) {
      return session;
    }
  }

  // If the user do not exists create it and create docebo user
  if (!account?.id && state.prompt !== "none") {
    account = await accountSrv.createAccount(session);

    await accountSrv.createDoceboUser(account);

    state.returnTo = "/api/silent-login";
    return session;
  }

  // If the user do not exists create it and create docebo user
  if (!account?.doceboUserId && state.prompt !== "none") {
    await accountSrv.createDoceboUser(account);

    state.returnTo = "/api/silent-login";
    return session;
  }
  return session;
};

export const getLoginOptions = (req) => {
  const { market } = getMarketAndEnvFromReq(req);

  // The returnTo is based on the baseUrl set when we init the auth0 library,
  // returning to / means that we return to the base url without the market
  // we have created an endpoint that is able to redirect the user to any absolute
  // url, in this wai we can redirect the user to the right market
  return {
    authorizationParams: {
      market
    }
  };
};

export default withLoggerApi(async (req: Request, res: NextApiResponse) => {
  // Add a request id to track the request
  if (!req.headers["x-request-id"]) {
    req.headers["x-request-id"] = v4();
  }

  const auth0 = await getAuth0Instance(req, res);

  const logger = req.logger("Auth0");

  const { handleAuth, handleCallback, handleProfile, handleLogout } = auth0;

  return handleAuth({
    async login(req, res) {
      try {
        const { authorizationParams } = getLoginOptions(req);

        await auth0.handleLogin(req, res, {
          authorizationParams
        });
      } catch (error) {
        logger.error(`handle login:`, error);
        return res.status(error.status || 500).end(error.message);
      }
    },

    async callback(req, res) {
      try {
        await handleCallback(req, res, { afterCallback });
      } catch (error) {
        logger.error(`handle callback`, error);

        if (req?.query?.error_description === "email_not_verified") {
          res.writeHead(302, { Location: "/email-verification" });
          return res.end();
        }

        if (req?.query?.error_description === "user is blocked") {
          res.writeHead(302, { Location: "/api-error?message=user_blocked" });
          return res.end();
        }

        res.writeHead(302, { Location: "/api-error?message=auth_error" });
        return res.end();
      }
    },
    async profile(req, res) {
      try {
        await handleProfile(req, res, {
          refetch: true
        });
      } catch (error) {
        logger.error(`handle profile`, error);
        const status = error.message === "invalid_token" ? 401 : error.status;
        return res.status(status || 500).end(error.message);
      }
    },
    async logout(req, res) {
      try {
        await handleLogout(req, res);
      } catch (error) {
        logger.error(`handle logout: `, error);
        return res.status(error.status || 500).end(error.message);
      }
    }
  })(req, res);
});
