import { gql } from "@apollo/client";
import validator from "validator";
import { initializeApollo } from "../../lib/apolloClient";
import withCors from "../../lib/middleware/withCors";

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
    const headers = {
      "x-request-id": req.headers["x-request-id"],
      "x-authenticated-user-id": req.headers["x-authenticated-user-id"],
      "x-api-key": process.env.GATEWAY_API_KEY,
      authorization: "Bearer undefined"
    };
    const apolloClient = initializeApollo(null, { req, res, headers });
    const { data } = await apolloClient.mutate({
      mutation: DELETE_INVITED_USER,
      variables: {
        email: validator.escape(email)
      }
    });
    if (data) {
      res.status(200).json({ data: validator.escape(data.deleteInvitedUser) });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "failed to validate user" });
  }
};

const DELETE_INVITED_USER = gql`
  mutation DeleteInvitedUser($email: String!) {
    deleteInvitedUser(email: $email)
  }
`;

export default withCors(corsOptions, handler);
