import { NextLogger } from "@bmi/logger";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { queryAccountByEmail } from "../account";

export const withApi = (handler) => async (req, res) => {
  const auth0 = await getAuth0Instance(req, res);

  if (req) {
    NextLogger(req, res);
  }

  return auth0.withApiAuthRequired(async (req, res) => {
    const { user, ...session } = auth0.getSession(req, res);
    const apolloClient = await initializeApollo(null, { req, res });

    const {
      data: { accountByEmail }
    } = await apolloClient.query({
      query: queryAccountByEmail,
      variables: {
        email: user.email
      }
    });

    return await handler(
      { ...req, accountByEmail, apolloClient, session: { user, ...session } },
      res
    );
  })(req, res);
};
