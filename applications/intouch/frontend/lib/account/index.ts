import axios from "axios";
import { v4 } from "uuid";

export const mutationCreateAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    account {
      id
    }
  }
}`;
export const createAccount = async (session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  // const market = user[`${AUTH0_NAMESPACE}/market`];
  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const type = user[`${AUTH0_NAMESPACE}/type`];

  const body = {
    query: mutationCreateAccount,
    variables: {
      input: {
        firstName,
        lastName,
        email: user.email,
        role: type === "company" ? "COMPANY_ADMIN" : "INSTALLER"
      }
    }
  };

  const { data } = await axios.post(process.env.GRAPHQL_URL, body, {
    headers: {
      authorization: `Bearer ${session.accessToken}`,
      "x-request-id": v4()
    }
  });

  return data;
};
