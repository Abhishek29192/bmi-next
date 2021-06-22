import { createAccount, invite } from "../";

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
  let contextMock = {
    user: {
      sub: "user-sub",
      intouchUserId: null,
      companyId: null
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

      expect(mockQuery.mock.calls).toEqual([
        [`SAVEPOINT graphql_mutation`],
        [`SELECT set_config('app.current_account_id', $1, true);`, [1]],
        [`SELECT * FROM company`, []],
        [`SELECT * FROM create_company()`, []],
        ["select * from market where id = $1", [1]],
        ["RELEASE SAVEPOINT graphql_mutation"]
      ]);

      expect(mockAuth0Update).toBeCalledWith("user-sub", {
        app_metadata: {
          intouch_market_code: args.input.marketCode,
          intouch_role: args.input.account.role,
          intouch_user_id: 1
        }
      });
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
        tiket: "my-ticket"
      });

      mockQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({
        rows: [
          {
            id: 1
          }
        ]
      });

      await invite(null, args, contextMock, null, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.email);
      expect(mockAuth0CreateUser).toBeCalledWith({
        email: args.input.email,
        connection: "Username-Password-Authentication",
        email_verified: false,
        password: "Gj$1Password",
        verify_email: false,
        user_metadata: {
          type: args.input.role.toLocaleLowerCase(),
          email: args.input.email,
          first_name: args.input.firstName,
          last_name: args.input.lastName
        }
      });
      expect(mockAuth0Update).toBeCalledWith("auth0|user-id", {
        app_metadata: {
          intouch_role: args.input.role,
          intouch_invited: true
        }
      });
    });
  });
});
