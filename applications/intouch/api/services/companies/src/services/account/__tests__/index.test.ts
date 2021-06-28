import { completeInvitation, createAccount, invite } from "../";
import * as eventsSrv from "../../../services/events";

const mockQuery = jest.fn();
const mockResolve = jest.fn();
const mockAuth0Update = jest.fn();
const mockAuth0GetUserByEmail = jest.fn();
const mockAuth0CreateUser = jest.fn();
const mockCreateResetPasswordTicket = jest.fn();

jest.mock("../../../services/events");

jest.mock("crypto", () => ({
  randomBytes: () => "Password"
}));

describe("Account", () => {
  const auth0 = {
    updateUser: mockAuth0Update,
    createResetPasswordTicket: mockCreateResetPasswordTicket,
    getUserByEmail: mockAuth0GetUserByEmail,
    createUser: mockAuth0CreateUser
  };
  let contextMock: any = {
    user: {
      sub: "user-sub",
      id: null
    },
    pgClient: { query: mockQuery },
    logger: () => ({
      error: () => {},
      info: () => {}
    })
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("Registration", () => {
    it("Should be able to register", async () => {
      const args = {
        input: {
          account: { role: "COMPANY_ADMIN" },
          marketCode: "en"
        }
      };

      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1, $role: args.input.account.role, $market_id: 1 }
      });

      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          rows: []
        })
        .mockResolvedValueOnce({
          rows: [{ status: "NEW" }]
        })
        .mockResolvedValueOnce({
          rows: [{ id: "id", domain: "en" }]
        });

      await createAccount(mockResolve, null, args, contextMock, null, auth0);

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });
  });

  describe("Invitation", () => {
    it("should invite a user", async () => {
      const args = {
        input: {
          email: "email",
          firstName: "firstName",
          lastName: "lastName",
          role: "COMPANY_ADMIN",
          note: "note"
        }
      };

      mockAuth0CreateUser.mockResolvedValueOnce({
        user_id: "auth0|user-id"
      });
      mockAuth0GetUserByEmail.mockResolvedValueOnce([]);
      mockCreateResetPasswordTicket.mockResolvedValueOnce({
        ticket: "my-ticket"
      });

      const spy = jest.spyOn(eventsSrv, "publish");

      mockQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({
        rows: [
          {
            id: 1
          }
        ]
      });

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          email: "email@email.com",
          marketDomain: "en",
          company: {
            id: 1
          }
        },
        pgClient: { query: mockQuery },
        logger: () => ({
          error: () => {},
          info: () => {}
        })
      };

      await invite(null, args, contextMock, null, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.email);

      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(spy.mock.calls).toMatchSnapshot();

      expect(mockAuth0CreateUser).toBeCalledWith({
        email: args.input.email,
        connection: "Username-Password-Authentication",
        email_verified: false,
        password: "Gj$1Password",
        verify_email: false,
        user_metadata: {
          registration_type: args.input.role.toLocaleLowerCase(),
          market: contextMock.user.marketDomain,
          first_name: args.input.firstName,
          last_name: args.input.lastName
        }
      });
    });

    it("should complete an invitation", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          firstName: "Name",
          lastName: "Lastname",
          role: "INSTALLER",
          email: "email@email.com",
          company: {
            id: 1
          }
        },
        pgClient: { query: mockQuery },
        logger: () => ({
          error: () => {},
          info: () => {}
        })
      };

      mockAuth0GetUserByEmail.mockImplementationOnce(() => [
        {
          user_metadata: {
            first_name: "Name",
            last_name: "Name",
            registration_type: "installer"
          }
        }
      ]);

      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // savepoint
        .mockResolvedValueOnce({ rows: [{ id: 1, market_id: 1 }] }) // invitation
        .mockResolvedValueOnce({ rows: [{ id: 1, market_id: 1 }] }) // account
        .mockResolvedValueOnce({ rows: [] }) // config
        .mockResolvedValueOnce({
          rows: [{ id: 1, account_id: 1, company_id: 1 }]
        }) // link_to_company
        .mockResolvedValueOnce({
          rows: [{ id: "id", domain: "en" }]
        }); // market

      await completeInvitation(null, args, contextMock, null, auth0);

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });

    it("should rollback an invitation if a query throw an error", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          firstName: "Name",
          lastName: "Lastname",
          role: "INSTALLER",
          email: "email@email.com",
          company: {
            id: 1
          }
        },
        pgClient: { query: mockQuery },
        logger: () => ({
          error: () => {},
          info: () => {}
        })
      };

      mockAuth0GetUserByEmail.mockImplementationOnce(() => [
        {
          user_metadata: {
            first_name: "Name",
            last_name: "Name",
            registration_type: "installer"
          }
        }
      ]);

      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // savepoint
        .mockRejectedValueOnce({}); // invitation

      try {
        await completeInvitation(null, args, contextMock, null, auth0);
      } catch (error) {
        expect(mockQuery.mock.calls).toMatchSnapshot();
      }
    });
  });
});
