import { Session } from "@auth0/nextjs-auth0";
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
    const session: Session = auth0.getSession(req, res);
    const apolloClient = await initializeApollo(null, { req, res });

    const {
      data: { accountByEmail }
    } = await apolloClient.query({
      query: queryAccountByEmail,
      variables: {
        email: session.user.email
      }
    });

    return await handler(
      { ...req, accountByEmail, apolloClient, session },
      res
    );
  })(req, res);
};
