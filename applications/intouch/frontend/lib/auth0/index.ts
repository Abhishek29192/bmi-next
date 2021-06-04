import { initAuth0 } from "@auth0/nextjs-auth0";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import { marketRedirect } from "../redirects/market";

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
    const { url, headers } = req;
    const protocol = headers["x-forwarded-proto"] || "http";

    // Process exist only on server side, so In eed to be sure req exists
    const {
      GCP_SECRET_PROJECT,
      AUTH0_NAMESPACE,
      AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID,
      AUTH0_COOKIE_DOMAIN
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
        baseURL: `${protocol}://${req.headers.host}`,
        issuerBaseURL: AUTH0_ISSUER_BASE_URL,
        clientID: AUTH0_CLIENT_ID,
        clientSecret: AUTH0_CLIENT_SECRET,
        secret: AUTH0_SECRET,
        session: {
          cookie: {
            domain: AUTH0_COOKIE_DOMAIN
          }
        }
      });
    }

    if (!url.includes("/api/") && !url.includes("_next")) {
      // Get the current session
      const session = auth0.getSession(req, res);
      if (session?.user) {
        await marketRedirect(req, res, session.user);
        // Check if the user is a company admin and if it has already registered the company
        const regCompleted =
          session?.user[`${AUTH0_NAMESPACE}/registration_to_complete`];
        // If company not registered then redirect him to the company registration
        if (req.url !== "/company-registration" && regCompleted) {
          res.writeHead(302, { Location: "/company-registration" });
          res.end();
        }
      }
    }

    return auth0;
  }
};
