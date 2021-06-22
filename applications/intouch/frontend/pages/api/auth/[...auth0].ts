import { Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth0Instance } from "../../../lib/auth0";
import { initializeApollo } from "../../../lib/apolloClient";
import Account from "../../../lib/account";
import { REDIRECT_MAP } from "../../../lib/config";
import { withLoggerApi } from "../../../lib/middleware/withLogger";

interface Request extends NextApiRequest {
  logger: any;
}

const getCompanyStatus = (account) => {
  if (!account) return null;

  const { companyMembers } = account;
  const { nodes } = companyMembers;

  return nodes?.[0]?.company?.status;
};

const afterCallback = async (
  req: Request,
  res: NextApiResponse,
  session: Session,
  state
) => {
  const apolloClient = await initializeApollo(null, { res, req, session });

  const accountSrv = new Account(req.logger, apolloClient, session);

  // Fetch the account
  let account = await accountSrv.getAccount(session);

  let companyStatus = getCompanyStatus(account);

  // If the user has a valid invitation return the session as the return url
  // in the reset password email will redirect him to /api/invitation
  const invitation = await accountSrv.getInvitation(session);
  if (invitation && !account?.id) {
    return session;
  }

  // If the user do not exists create it and create docebo user
  if (!account?.id && state.prompt !== "none") {
    account = await accountSrv.createAccount(session);
    companyStatus = getCompanyStatus(account);

    await accountSrv.createDoceboUser(session, account);

    state.returnTo = "/api/silent-login";
    return {
      ...session,
      user: {
        ...session.user,
        ...(companyStatus === "NEW" && {
          companyStatus
        })
      }
    };
  }

  // If the user do not exists create it and create docebo user
  if (!account?.doceboUserId && state.prompt !== "none") {
    await accountSrv.createDoceboUser(session, account);
    companyStatus = getCompanyStatus(account);

    state.returnTo = "/api/silent-login";

    return {
      ...session,
      user: {
        ...session.user,
        ...(companyStatus === "NEW" && {
          companyStatus
        })
      }
    };
  }

  return {
    ...session,
    user: {
      ...session.user,
      ...(companyStatus === "NEW" && {
        companyStatus
      })
    }
  };
};

export const getMarketFromReq = (req, res) => {
  let { host } = req.headers;

  // local
  if (host.indexOf(":") !== -1) {
    host = host.split(":")[0];

    return REDIRECT_MAP[`${host}`];
  }

  return REDIRECT_MAP[`${host}`];
};

export const loginHandler = async (req, res, auth0, logger) => {
  try {
    logger.info("Login and redirect with this params: ", {
      authorizationParams: {
        market: getMarketFromReq(req, res)
      },
      returnTo: req.query.returnTo || "/"
    });

    await auth0.handleLogin(req, res, {
      authorizationParams: {
        market: getMarketFromReq(req, res)
      },
      returnTo: req.query.returnTo || "/"
    });
  } catch (error) {
    logger.error(`handle login:`, error);
    return res.status(error.status || 500).end(error.message);
  }
};

export default withLoggerApi(async (req: Request, res: NextApiResponse) => {
  const auth0 = await getAuth0Instance(req, res);

  const logger = req.logger("Auth0");

  const { handleAuth, handleCallback, handleProfile, handleLogout } = auth0;

  return handleAuth({
    async login(req, res) {
      return loginHandler(req, res, auth0, logger);
    },
    async callback(req, res) {
      try {
        await handleCallback(req, res, { afterCallback });
      } catch (error) {
        logger.error(`handle callback`, error);
        return res.status(error.status || 500).end(error.message);
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
