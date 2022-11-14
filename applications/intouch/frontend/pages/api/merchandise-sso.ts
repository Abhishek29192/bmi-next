import { withLoggerApi } from "../../lib/middleware/withLogger";
import Merchandise from "../../lib/merchandise";
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
  const logger = req.logger("merchandise-login");

  if (session) {
    const accessToken = session?.accessToken;
    const apolloClient = await initializeApollo(null, {
      req,
      res,
      accessToken
    });
    const merchandiseSrv = new Merchandise(req.logger, apolloClient, session);

    const data = await merchandiseSrv.completeMerchandiseSso();
    res.writeHead(302, { Location: data.performMerchandiseSso });
    res.end();
  } else {
    logger.info("Redirect to login");
    res.writeHead(302, {
      Location: `/api/auth/login`
    });
    res.end();
  }
};

export default withLoggerApi(handler);
