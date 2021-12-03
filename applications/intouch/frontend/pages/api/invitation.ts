import { withLoggerApi } from "../../lib/middleware/withLogger";
import Account from "../../lib/account";
import { getAuth0Instance } from "../../lib/auth0";
import { initializeApollo } from "../../lib/apolloClient";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export const handler = async (req, res) => {
  const auth0 = await getAuth0Instance(req, res);
  const session = auth0.getSession(req, res);

  let accessToken = session?.accessToken;

  if (Date.now() >= session?.accessTokenExpiresAt * 1000) {
    const newAccessToken = await auth0.getAccessToken(req, res, {
      refresh: true
    });
    console.log("inv: refreshing access token", newAccessToken);
    console.log("inv: refreshing access token", newAccessToken.accessToken);

    accessToken = newAccessToken?.accessToken;
  }

  const apolloClient = await initializeApollo(null, { req, res, accessToken });
  const accountSrv = new Account(req.logger, apolloClient, session);

  const logger = req.logger("api:invitation");

  if (!session) {
    logger.info(`
      Redirect to login and return to /api/invitation?company_id=${req.query.company_id}
    `);
    res.writeHead(302, {
      Location: `/api/auth/login?returnTo=/api/invitation?company_id=${req.query.company_id}`
    });
    res.end();
  } else {
    logger.info("Completing the invitation");

    try {
      const { completeInvitation: account } =
        await accountSrv.completeAccountInvitation(req);

      await accountSrv.createDoceboUser(account);

      res.writeHead(302, { Location: "/api/silent-login" });
      res.end();
    } catch (error) {
      res.writeHead(302, { Location: `/api-error?message=${error.message}` });
      res.end();
    }
  }
};

export default withLoggerApi(handler);
