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

export default withLoggerApi(async (req, res) => {
  const auth0 = await getAuth0Instance(req, res);
  const session = auth0.getSession(req, res);
  const apolloClient = await initializeApollo(null, { req, res });
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
    const { completeInvitation } = await accountSrv.completeAccountInvitation(
      req
    );

    await accountSrv.createDoceboUser(completeInvitation);

    res.writeHead(302, { Location: "/api/silent-login" });
    res.end();
  }
});
