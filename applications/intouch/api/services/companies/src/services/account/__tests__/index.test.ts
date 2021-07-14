import { completeInvitation, createAccount, invite } from "../";
import * as eventsSrv from "../../../services/events";
import { company } from "../../../fixtures";

const mockQuery = jest.fn();
const mockRootQuery = jest.fn();
const mockResolve = jest.fn();
const mockAuth0Update = jest.fn();
const mockAuth0GetUserByEmail = jest.fn();
const mockAuth0CreateUser = jest.fn();
const mockCreateResetPasswordTicket = jest.fn();

jest.mock("../../../services/events");

jest.mock("crypto", () => ({
  randomBytes: () => "Password"
}));

let logger = () => ({
  error: () => {},
  info: () => {}
});

describe("Account", () => {
  let args;
  let resolveInfo;
  const auth0 = {
    updateUser: mockAuth0Update,
    createResetPasswordTicket: mockCreateResetPasswordTicket,
    getUserByEmail: mockAuth0GetUserByEmail,
    createUser: mockAuth0CreateUser
  };
  let queryBuilder = () => ({
    where: () => {}
  });
  let build = {
    pgSql: {
      fragment: (args) => queryBuilder,
      value: (args) => {}
    }
  };
  let contextMock: any = {
    user: {
      sub: "user-sub",
      id: null
    },
    pgClient: { query: mockQuery },
    pgRootPool: { query: mockRootQuery },
    logger
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    args = {
      input: {
        account: { role: "COMPANY_ADMIN" },
        marketCode: "en"
      }
    };
    resolveInfo = {
      graphile: {
        selectGraphQLResultFromTable: jest.fn(),
        build
      }
    };
  });

  describe("Registration", () => {
    it("Should be able to register as company_admin", async () => {
      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1 }
      });

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValueOnce([
        {}
      ]);

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({}) // set user
        .mockResolvedValueOnce({ rows: [] }); // get company

      await createAccount(mockResolve, null, args, contextMock, resolveInfo);

      expect(mockResolve.mock.calls).toMatchSnapshot();
    });
    it("Should be able to register as installer", async () => {
      args.input.account.role = "INSTALLER";
      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1 }
      });

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValueOnce([
        {}
      ]);

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({}) // set user
        .mockResolvedValueOnce({ rows: [] }); // get company

      await createAccount(mockResolve, null, args, contextMock, resolveInfo);

      expect(mockResolve.mock.calls).toMatchSnapshot();
    });
  });

  describe("Invitation", () => {
    let args;
    let contextMock;
    let resolveInfo;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      args = {
        input: {
          emails: ["email"],
          firstName: "firstName",
          lastName: "lastName",
          role: "INSTALLER",
          personalNote: "personalNote"
        }
      };

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          role: "INSTALLER",
          email: "email@email.com",
          marketDomain: "en",
          company: {
            ...company
          }
        },
        pgClient: { query: mockQuery },
        pgRootPool: { query: mockRootQuery },
        logger
      };

      resolveInfo = {
        graphile: {
          selectGraphQLResultFromTable: jest.fn(),
          build
        }
      };
    });

    it("shouldn't be able to invite a user if installer", async () => {
      try {
        await invite(null, args, contextMock, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual(
          "you must be an admin to invite other users"
        );
      }
    });

    it("should invite a user sending a change password email if not exists", async () => {
      contextMock.user.role = "COMAPNY_ADMIN";

      mockAuth0CreateUser.mockResolvedValueOnce({
        user_id: "auth0|user-id"
      });
      mockAuth0GetUserByEmail.mockResolvedValueOnce(null);
      mockCreateResetPasswordTicket.mockResolvedValueOnce({
        ticket: "my-ticket"
      });

      const spy = jest.spyOn(eventsSrv, "publish");

      mockRootQuery
        // get user
        .mockResolvedValueOnce({ rows: [] });

      mockQuery
        // insert invitation
        .mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await invite(null, args, contextMock, resolveInfo, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.emails[0]);
      expect(mockAuth0CreateUser).toBeCalledWith({
        email: args.input.emails[0],
        connection: "Username-Password-Authentication",
        email_verified: false,
        password: "Gj$1Password",
        verify_email: false,
        user_metadata: {
          intouch_role: args.input.role,
          market: contextMock.user.marketDomain,
          first_name: args.input.firstName,
          last_name: args.input.lastName
        }
      });
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("should invite a user sending complete invitation email if exists", async () => {
      contextMock.user.role = "COMAPNY_ADMIN";

      mockAuth0GetUserByEmail.mockResolvedValueOnce({
        email: "email@email.co.uk"
      });

      const spy = jest.spyOn(eventsSrv, "publish");

      mockRootQuery
        // get user
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              role: "INSTALLER"
            }
          ]
        })
        // get company_member
        .mockResolvedValueOnce({ rows: [] });

      await invite(null, args, contextMock, resolveInfo, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.emails[0]);
      expect(mockCreateResetPasswordTicket).toHaveBeenCalledTimes(0);
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("should receive an error if the invetee is a company_admin", async () => {
      contextMock.user.role = "COMAPNY_ADMIN";

      mockAuth0GetUserByEmail.mockResolvedValueOnce({
        email: "email@email.co.uk"
      });

      mockRootQuery
        // get user
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              role: "COMPANY_ADMIN"
            }
          ]
        });

      try {
        await invite(null, args, contextMock, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual("You can't invite company admin");
      }
    });

    it("should receive an error if the invetee is part of a company", async () => {
      contextMock.user.role = "COMAPNY_ADMIN";

      mockAuth0GetUserByEmail.mockResolvedValueOnce({
        email: "email@email.co.uk"
      });

      mockRootQuery
        // get user
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              role: "INSTALLER"
            }
          ]
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1
            }
          ]
        });

      try {
        await invite(null, args, contextMock, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual(
          "The user is already a member of another company"
        );
      }
    });

    it("should complete an invitation", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        user: {
          email: "email@email.com"
        },
        pgClient: { query: mockQuery },
        pgRootPool: { query: mockRootQuery },
        logger
      };

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValueOnce([
        {}
      ]);

      mockAuth0GetUserByEmail.mockImplementationOnce(() => ({
        user_metadata: {
          first_name: "Name",
          last_name: "Name",
          intouch_role: "installer"
        }
      }));

      mockRootQuery
        // invitation
        .mockResolvedValueOnce({
          rows: [{ id: 1, market_id: 1, company_id: 1 }]
        });

      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // savepoint
        .mockResolvedValueOnce({ rows: [{ id: 1, market_id: 1 }] }) // account
        .mockResolvedValueOnce({ rows: [] }) // config
        .mockResolvedValueOnce({
          rows: [{ id: 2, account_id: 1, market_id: 1, company_id: 1 }]
        }); // company_member

      await completeInvitation(
        null,
        args,
        contextMock,
        resolveInfo,
        auth0,
        build
      );

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });

    it("should rollback an invitation if a query throw an error", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        ...contextMock,
        user: {
          email: "email@email.com"
        }
      };

      mockRootQuery
        // invitation
        .mockResolvedValueOnce({
          rows: [{ id: 1, market_id: 1, company_id: 1 }]
        });

      mockAuth0GetUserByEmail.mockImplementationOnce(() => ({
        user_metadata: {
          first_name: "Name",
          last_name: "Name",
          intouch_role: "installer"
        }
      }));

      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // savepoint
        .mockRejectedValueOnce({}); // invitation

      try {
        await completeInvitation(
          null,
          args,
          contextMock,
          resolveInfo,
          auth0,
          build
        );
      } catch (error) {
        expect(mockQuery.mock.calls).toMatchSnapshot();
      }
    });
  });
});
