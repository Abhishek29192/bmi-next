process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GRAPHQL_URL = "GRAPHQL_URL";

import Account from "../";

describe("Account", () => {
  // let accountSrv;

  // const session = {};
  // const logger = () => {};
  // const apolloClient = () => {};

  // beforeEach(() => {
  //   accountSrv = new Account(logger, apolloClient, session);
  // });

  it("should send the create mutation with the right values", async () => {
    // axios.post = jest.fn().mockResolvedValue({
    //   data: {
    //     data: {
    //       createAccount: {
    //         account: {
    //           id: 1
    //         }
    //       }
    //     }
    //   }
    // });
    // await accountSrv.createAccount(session);
    // expect(axios.post).toHaveBeenCalledWith(
    //   `http://graphql/api/graphql`,
    //   {
    //     query: mutationCreateAccount,
    //     variables: {
    //       input: {
    //         account: {
    //           firstName: "Name",
    //           lastName: "Lastname",
    //           email: "email",
    //           role: "COMPANY_ADMIN"
    //         },
    //         marketCode: "en"
    //       }
    //     }
    //   },
    //   {
    //     headers: {
    //       authorization: `Bearer ${session.accessToken}`,
    //       "x-request-id": "uuid"
    //     }
    //   }
    // );
  });
});
