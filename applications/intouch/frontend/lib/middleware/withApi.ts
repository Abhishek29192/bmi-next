import { Session } from "@auth0/nextjs-auth0";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { queryAccountByEmail } from "../account";
import { withLoggerApi } from "../middleware/withLogger";

export const withApi = (handler) =>
  withLoggerApi(async (req, res) => {
    const auth0 = await getAuth0Instance(req, res);

    return auth0.withApiAuthRequired(async (req, res) => {
      const session: Session = auth0.getSession(req, res);

      let accessToken = session.accessToken;

      if (Date.now() >= session.accessTokenExpiresAt * 1000) {
        const newAccessToken = await auth0.getAccessToken(req, res, {
          refresh: true
        });
        console.log("withApi: refreshing access token", newAccessToken);
        console.log(
          "withApi: refreshing access token",
          newAccessToken.accessToken
        );

        accessToken = newAccessToken?.accessToken;
      }

      const apolloClient = await initializeApollo(null, {
        req,
        res,
        accessToken
      });

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
  });
