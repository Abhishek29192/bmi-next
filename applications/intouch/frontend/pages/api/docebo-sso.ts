import { withApi } from "../../lib/middleware/withApi";
import Account from "../../lib/account";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

// This api endpoint let us do a SSO login to Docebo
export default withApi(async (req, res) => {
  const logger = req.logger("docebo-login");
  const accountSrv = new Account(req.logger, req.apolloClient, req.session);

  if (req.session) {
    const url = await accountSrv.createDoceboSSOUrl(req, req.session);
    res.writeHead(302, { Location: url });
    res.end();
  } else {
    logger.info("Redirect to login");
    res.writeHead(302, {
      Location: `/api/auth/login`
    });
    res.end();
  }
});
