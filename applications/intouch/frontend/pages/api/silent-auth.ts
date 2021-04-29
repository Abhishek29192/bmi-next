import { LoginOptions, handleLogin } from "@auth0/nextjs-auth0";

// This api endpoint let us do a silent login, if the user has a valid session in auth0 but not in our application we can login him without adding any credential
// This is also usefull to get the last state of the user
export default async function silentAuth(req, res) {
  const { returnTo } = req.query;

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
    await handleLogin(req, res, loginOption);
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
