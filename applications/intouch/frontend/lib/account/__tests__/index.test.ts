import axios from "axios";
import { createAccount, mutationCreateAccount } from "../";

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GRAPHQL_URL = "GRAPHQL_URL";

jest.mock("axios");
jest.mock("uuid", () => ({
  v4: () => "uuid"
}));

describe("Account", () => {
  const session = {
    accessToken: "my-token",
    user: {
      email: "email",
      [`${process.env.AUTH0_NAMESPACE}/firstname`]: "Name",
      [`${process.env.AUTH0_NAMESPACE}/lastname`]: "Lastname",
      [`${process.env.AUTH0_NAMESPACE}/type`]: "company"
    }
  };
  const req = {
    headers: {
      host: "graphql"
    }
  };
  it("should send a mutation with the right values", async () => {
    axios.post = jest.fn().mockResolvedValue({ data: {} });

    await createAccount(req, session);
    expect(axios.post).toHaveBeenCalledWith(
      `http://graphql/api/graphql`,
      {
        query: mutationCreateAccount,
        variables: {
          input: {
            firstName: "Name",
            lastName: "Lastname",
            email: "email",
            role: "COMPANY_ADMIN"
          }
        }
      },
      {
        headers: {
          authorization: `Bearer ${session.accessToken}`,
          "x-request-id": "uuid"
        }
      }
    );
  });
});
