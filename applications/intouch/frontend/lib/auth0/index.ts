import { initAuth0 } from "@auth0/nextjs-auth0";
import { getSecret } from "../utils/secrets";

let auth0;

export const getAuth0Instance = async (req, res) => {
  // Only server side
  if (req) {
    // Process exist only on server side, so In eed to be sure req exists
    const {
      GCP_SECRET_PROJECT,
      AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID,
      AUTH0_COOKIE_DOMAIN
    } = process.env;

    if (!auth0) {
      const AUTH0_CLIENT_SECRET = await getSecret(
        GCP_SECRET_PROJECT,
        "AUTH0_CLIENT_SECRET"
      );
      const AUTH0_SECRET = await getSecret(GCP_SECRET_PROJECT, "AUTH0_SECRET");

      const protocol = req.headers["x-forwarded-proto"] || "http";

      // dynamically redirecting to the request host using `req.headers.host`
      // is currently problematic with the Load Balancer (or the WAF) directing requests to the frontend
      // using a less dynamic fixed URL approach for now
      auth0 = initAuth0({
        baseURL: `${protocol}://${req.headers.host}`,
        issuerBaseURL: AUTH0_ISSUER_BASE_URL,
        clientID: AUTH0_CLIENT_ID,
        clientSecret: AUTH0_CLIENT_SECRET,
        secret: AUTH0_SECRET, // Used to signing the cookie
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
