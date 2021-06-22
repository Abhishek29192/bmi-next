import { getAuth0Instance } from "../../lib/auth0";
import { withLoggerApi } from "../../lib/middleware/withLogger";
import { completeAccountInvitation, createDoceboUser } from "../../lib/account";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default withLoggerApi(async (req, res) => {
  const logger = req.logger("Invitation");
  const auth0 = await getAuth0Instance(req, res);
  const session = await auth0.getSession(req, res);

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
    const { completeInvitation } = await completeAccountInvitation(
      req,
      session
    );

    await createDoceboUser(req, session, completeInvitation);

    res.writeHead(302, { Location: "/api/silent-login" });
    res.end();
  }
});
