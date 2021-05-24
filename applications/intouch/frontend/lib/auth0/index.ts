import axios from "axios";
import { initAuth0 } from "@auth0/nextjs-auth0";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import { marketRedirect } from "../redirects/market";

const USER_UNAUTHORIZED = "unauthorized (user is blocked)";

let auth0;

const getSecret = async (client, project, key) => {
  const values = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${key}/versions/latest`
  });
  return values[0].payload.data.toString();
};

export const getAuth0Instance = async (req, res) => {
  // Only server side
  if (req) {
    const { url } = req;

    // Process exist only on server side, so In eed to be sure req exists
    const {
      GCP_SECRET_PROJECT,
      AUTH0_NAMESPACE,
      AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID,
      AUTH0_COOKIE_DOMAIN,
      AUTH0_COOKIE_PATH
    } = process.env;

    if (!auth0) {
      const client = new SecretManagerServiceClient();

      const AUTH0_CLIENT_SECRET = await getSecret(
        client,
        GCP_SECRET_PROJECT,
        "AUTH0_CLIENT_SECRET"
      );
      const AUTH0_SECRET = await getSecret(
        client,
        GCP_SECRET_PROJECT,
        "AUTH0_SECRET"
      );

      auth0 = initAuth0({
        baseURL: `http://${req.headers.host}`,
        issuerBaseURL: AUTH0_ISSUER_BASE_URL,
        clientID: AUTH0_CLIENT_ID,
        clientSecret: AUTH0_CLIENT_SECRET,
        secret: AUTH0_SECRET,
        session: {
          cookie: {
            domain: AUTH0_COOKIE_DOMAIN,
            path: AUTH0_COOKIE_PATH
          }
        }
      });
    }

    if (!url.includes("/api/") && !url.includes("_next")) {
      try {
        // Get the current session
        const session = await auth0.getSession(req, res);
        await marketRedirect(req, res, session);

        // eslint-disable-next-line no-console
        console.log("Check /auth/me", req.url);
        // Check if the session is valid

        await axios.get(`http://${req.headers.host}/api/auth/me`, {
          headers: {
            cookie: req?.headers?.cookie
          }
        });

        // Check if the user is a company admin and if it has already registered the company
        const { user } = session;
        const regCompleted =
          user[`${AUTH0_NAMESPACE}/registration_to_complete`];
        // If company not registered then redirect him to the company registration
        if (req.url !== "/company-registration" && regCompleted) {
          res.writeHead(302, { Location: "/company-registration" });
          res.end();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("error", error);
        // If Unauthorized user redirect to the logout
        if (
          error?.response?.status === 401 ||
          error?.response?.data === USER_UNAUTHORIZED
        ) {
          res.writeHead(302, { Location: "/api/auth/logout" });
          res.end();
        }
      }
    }

    return auth0;
  }
};
