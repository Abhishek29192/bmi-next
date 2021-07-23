import { initAuth0 } from "@auth0/nextjs-auth0";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

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
    const { headers } = req;
    const protocol = headers["x-forwarded-proto"] || "http";

    // Process exist only on server side, so In eed to be sure req exists
    const {
      GCP_SECRET_PROJECT,
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

    return auth0;
  }
};
