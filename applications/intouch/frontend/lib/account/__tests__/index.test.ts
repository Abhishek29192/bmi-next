import axios from "axios";

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GRAPHQL_URL = "GRAPHQL_URL";

import { createAccount, mutationCreateAccount } from "../";

jest.mock("axios");
jest.mock("uuid", () => ({
  v4: () => "uuid"
}));

describe("Account", () => {
  const session = {
    accessToken: "my-token",
    user: {
      [`${process.env.AUTH0_NAMESPACE}/email`]: "email",
      [`${process.env.AUTH0_NAMESPACE}/first_name`]: "Name",
      [`${process.env.AUTH0_NAMESPACE}/last_name`]: "Lastname",
      [`${process.env.AUTH0_NAMESPACE}/registration_type`]: "company",
      [`${process.env.AUTH0_NAMESPACE}/intouch_market_code`]: "en"
    }
  };
  const req = {
    logger: () => ({
      info: jest.fn(),
      error: jest.fn()
    }),
    headers: {
      host: "graphql"
    }
  };

  it("should send the create mutation with the right values", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        data: {
          createAccount: {
            account: {
              id: 1
            }
          }
        }
      }
    });

    await createAccount(req, session);

    expect(axios.post).toHaveBeenCalledWith(
      `http://graphql/api/graphql`,
      {
        query: mutationCreateAccount,
        variables: {
          input: {
            account: {
              firstName: "Name",
              lastName: "Lastname",
              email: "email",
              role: "COMPANY_ADMIN"
            },
            marketCode: "en"
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
