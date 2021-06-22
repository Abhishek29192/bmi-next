import { withApi } from "../../lib/middleware/withApi";
import Account from "../../lib/account";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default withApi(async (req, res) => {
  const { logger, apolloClient, session } = req;
  const accountSrv = new Account(logger, apolloClient, session);

  logger.info("start");

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
      session
    );

    await accountSrv.createDoceboUser(session, completeInvitation);

    res.writeHead(302, { Location: "/api/silent-login" });
    res.end();
  }
});
