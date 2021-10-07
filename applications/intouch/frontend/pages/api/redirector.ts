import { withLoggerApi } from "../../lib/middleware/withLogger";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export const handler = async (req, res) => {
  res.writeHead(302, { Location: req.query.current });
  res.end();
};

export default withLoggerApi(handler);
