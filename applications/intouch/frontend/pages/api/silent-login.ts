import { LoginOptions } from "@auth0/nextjs-auth0";
import { getAuth0Instance } from "../../lib/auth0";
import { withLoggerApi } from "../../lib/logger/withLogger";

// This api endpoint let us do a silent login, if the user has a valid session in auth0 but not in our application we can login him without adding any credential
// This is also usefull to get the last state of the user
export default withLoggerApi(async (req, res) => {
  const { returnTo } = req.query;
  const logger = req.logger("silent-login");

  const auth0 = await getAuth0Instance(req, res);
  const loginOption: LoginOptions = {
    authorizationParams: {
      prompt: "none"
    },
    getLoginState: () => ({ prompt: "none" })
  };

  if (returnTo) {
    loginOption.returnTo = returnTo;
  }

  try {
    await auth0.handleLogin(req, res, loginOption);
  } catch (error) {
    logger.error(error.message);
    res.status(error.status || 500).end(error.message);
  }
});
