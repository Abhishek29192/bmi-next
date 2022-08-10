import { gql } from "@apollo/client";
import validator from "validator";
import withCors from "../../lib/middleware/withCors";
import { initializeApollo } from "../../lib/apolloClient";
import { getSecret } from "../../lib/utils/secrets";

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};

const corsOptions = {
  origins: [process.env.AUTH0_ISSUER_BASE_URL],
  methods: ["POST"]
};

export const handler = async (req, res) => {
  const logger = req.logger("api:validate-user");
  const { email } = req.body;

  try {
    const GATEWAY_API_KEY = await getSecret(
      process.env.GCP_SECRET_PROJECT,
      "GATEWAY_API_KEY"
    );
    const headers = {
      "x-request-id": req.headers["x-request-id"],
      "x-authenticated-user-id": req.headers["x-authenticated-user-id"],
      "x-api-key": GATEWAY_API_KEY,
      authorization: "Bearer undefined"
    };
    const apolloClient = initializeApollo(null, { req, res, headers });
    const { data } = await apolloClient.mutate({
      mutation: VALIDATE_USER,
      variables: {
        email: validator.escape(email)
      }
    });
    if (data) {
      res.status(200).json({ data: data.validateSignupUser });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "failed to validate user" });
  }
};

const VALIDATE_USER = gql`
  mutation validateSignupUser($email: String!) {
    validateSignupUser(email: $email)
  }
`;

export default withCors(corsOptions, handler);