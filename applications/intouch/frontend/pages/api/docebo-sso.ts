import { getAuth0Instance } from "../../lib/auth0";
import { withLoggerApi } from "../../lib/logger/withLogger";
import { createDoceboSSOUrl } from "../../lib/account";

// This api endpoint let us do a SSO login to Docebo
export default withLoggerApi(async (req, res) => {
  const logger = req.logger("docebo-login");
  const auth0 = await getAuth0Instance(req, res);
  const session = await auth0.getSession(req, res);

  if (session) {
    const url = await createDoceboSSOUrl(req, session);
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
