process.env.FRONTEND_URL = "intouch.dddev.io";
process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.APP_ENV = "dev";

import {
  completeInvitation,
  createAccount,
  invite,
  updateAccount,
  resetPasswordImportedUsers
} from "../";
import * as mailerSrv from "../../../services/mailer";
import * as trainingSrv from "../../../services/training";
import { getDbPool } from "../../../test-utils/db";
import { company } from "../../../fixtures";

const mockPubSub = jest.fn();
const mockQuery = jest.fn();
const mockRootQuery = jest.fn();
const mockResolve = jest.fn();
const mockAuth0Update = jest.fn();
const mockAuth0GetUserByEmail = jest.fn();
const mockAuth0CreateUser = jest.fn();
const mockCreateResetPasswordTicket = jest.fn();
const mockClientGateway = jest.fn();

jest.mock("../../../services/events");
jest.mock("../../../services/mailer");
jest.mock("../../../services/training");

jest.mock("crypto", () => {
  const original = jest.requireActual("crypto");
  return {
    createHash: original.createHash,
    randomBytes: () => "Password"
  };
});

let logger = () => ({
  error: () => {},
  info: () => {}
});

describe("Account", () => {
  let args;
  let pool;
  let resolveInfo;
  const userCanMock = jest.fn();
  const userTermsToAccept = jest.fn();
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
      id: null,
      [`${process.env.AUTH0_NAMESPACE}/terms_to_accept`]: userTermsToAccept,
      can: userCanMock
    },
    pubSub: mockPubSub,
    clientGateway: mockClientGateway,
    pgClient: { query: mockQuery },
    pgRootPool: { query: mockRootQuery },
    logger
  };

  beforeAll(async () => {
    pool = await getDbPool();
  });
  afterAll(async () => {
    await pool.end();
  });

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

  describe("Update", () => {
    describe("Role", () => {
      it("should resolve if a company admin promote a installer", async () => {
        (contextMock.user.can as jest.Mock)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);

        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "COMPANY_ADMIN"
            }
          }
        };

        (mailerSrv.sendMessageWithTemplate as jest.Mock).mockResolvedValueOnce(
          {}
        );

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "INSTALLER" }]
          }));

        mockResolve.mockResolvedValueOnce({
          data: {
            $first_name: "Name",
            $email: "email@email.co.uk",
            $docebo_user_id: 123456
          }
        });

        await updateAccount(
          mockResolve,
          null,
          args,
          contextMock,
          resolveInfo,
          auth0
        );

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith(
          contextMock.clientGateway,
          {
            userid: "123456",
            level: 4
          }
        );
        expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
          contextMock,
          "ROLE_ASSIGNED",
          {
            email: "email@email.co.uk",
            role: "company admin",
            firstname: "Name"
          }
        );
      });

      it("should resolve if a company admin downgrade an installer", async () => {
        (contextMock.user.can as jest.Mock)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);

        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER"
            }
          }
        };

        (mailerSrv.sendMessageWithTemplate as jest.Mock).mockResolvedValueOnce(
          {}
        );

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [
              { id: 2, role: "COMPANY_ADMIN" },
              { id: 2, role: "COMPANY_ADMIN" }
            ]
          }));

        mockResolve.mockResolvedValueOnce({
          data: {
            $first_name: "Name",
            $email: "email@email.co.uk",
            $docebo_user_id: 123456
          }
        });

        await updateAccount(
          mockResolve,
          null,
          args,
          contextMock,
          resolveInfo,
          auth0
        );

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith(
          contextMock.clientGateway,
          {
            userid: "123456",
            level: 6
          }
        );
        expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
          contextMock,
          "ROLE_ASSIGNED",
          {
            email: "email@email.co.uk",
            role: "installer",
            firstname: "Name"
          }
        );
      });

      it("should trown an error if last admin", async () => {
        contextMock.user.can = () => true;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER"
            }
          }
        };

        (mailerSrv.sendMessageWithTemplate as jest.Mock).mockResolvedValueOnce(
          {}
        );

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "COMPANY_ADMIN" }]
          }));

        mockResolve.mockResolvedValueOnce({
          data: {
            $first_name: "Name",
            $email: "email@email.co.uk",
            $docebo_user_id: 123456
          }
        });

        try {
          await updateAccount(
            mockResolve,
            null,
            args,
            contextMock,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(error.message).toEqual("last_company_admin");
        }
      });
    });

    describe("Accept terms and condition", () => {
      it("should update the auth0 user_meta.terms_to_accept value if imported user", async () => {
        args = {
          input: {
            id: 2,
            patch: {
              termsCondition: true
            }
          }
        };

        userTermsToAccept.mockReturnValueOnce(true);

        await updateAccount(
          mockResolve,
          null,
          args,
          contextMock,
          resolveInfo,
          auth0
        );

        expect(auth0.updateUser).toHaveBeenCalledWith("user-sub", {
          app_metadata: {
            terms_to_accept: false
          }
        });
      });
    });
  });

  describe("Registration", () => {
    beforeEach(() => {
      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          can: () => true
        },
        pgClient: { query: mockQuery },
        pgRootPool: { query: mockRootQuery },
        logger,
        protocol: "https"
      };
    });

    it("Should be able to register as company_admin", async () => {
      mockResolve.mockResolvedValueOnce({
        data: {
          $account_id: 1,
          $market_id: 1,
          $email: "email",
          $first_name: "first_name"
        }
      });

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValueOnce([
        {}
      ]);

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({}) // set user
        .mockResolvedValueOnce({ rows: [] }) // get company
        .mockResolvedValueOnce({ rows: [] }) // create company
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: "domain"
            }
          ]
        }); // get market

      await createAccount(mockResolve, null, args, contextMock, resolveInfo);

      expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
        {
          ...contextMock,
          user: {
            ...contextMock.user,
            market: { sendMailbox: "send_mailbox" },
            id: 1
          }
        },
        "ACCOUNT_ACTIVATED",
        {
          email: "email",
          firstname: "first_name",
          marketUrl: `https://dev-domain.intouch.dddev.io`
        }
      );

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });
    it("Should be able to register as installer", async () => {
      args.input.account.role = "INSTALLER";
      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1 }
      });

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValue([{}]);

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({}) // set user
        .mockResolvedValueOnce({ rows: [] }) // get company
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: "domain"
            }
          ]
        }); // get market

      await createAccount(mockResolve, null, args, contextMock, resolveInfo);

      expect(mockQuery.mock.calls).toMatchSnapshot();
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
          market: { domain: "en" },
          company: {
            ...company
          },
          can: userCanMock
        },
        req: {
          protocol: "https"
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
      userCanMock.mockImplementationOnce(() => false);
      try {
        await invite(null, args, contextMock, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual(
          "you must be an admin to invite other users"
        );
      }
    });

    it("should invite a user sending a change password email if not exists", async () => {
      contextMock.user.can = () => true;

      mockAuth0CreateUser.mockResolvedValueOnce({
        user_id: "auth0|user-id"
      });
      mockAuth0GetUserByEmail.mockResolvedValueOnce(null);
      mockCreateResetPasswordTicket.mockResolvedValueOnce({
        ticket: "my-ticket"
      });

      const spy = jest.spyOn(mailerSrv, "sendMessageWithTemplate");

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
          market: contextMock.user.market.domain,
          first_name: args.input.firstName,
          last_name: args.input.lastName
        }
      });
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("should invite a user sending complete invitation email if exists", async () => {
      contextMock.user.can = () => true;
      mockAuth0GetUserByEmail.mockResolvedValueOnce({
        email: "email@email.co.uk"
      });

      const spy = jest.spyOn(mailerSrv, "sendMessageWithTemplate");

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

    it("should receive an error if the invetee is part of a company", async () => {
      contextMock.user.can = () => true;

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
        logger,
        protocol: "https"
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
          rows: [
            {
              id: 1,
              market_id: 1,
              company_id: 1
            }
          ]
        });

      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // savepoint
        .mockResolvedValueOnce({
          rows: [
            { id: 1, market_id: 1, email: "email", first_name: "first_name" }
          ]
        }) // account
        .mockResolvedValueOnce({ rows: [] }) // config
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: "domain"
            }
          ]
        }) // market
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

      expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
        {
          ...contextMock,
          user: {
            ...contextMock.user,
            market: { sendMailbox: "send_mailbox" },
            id: 1
          }
        },
        "ACCOUNT_ACTIVATED",
        {
          email: "email",
          firstname: "first_name",
          marketUrl: `https://dev-domain.intouch.dddev.io`
        }
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

  describe("Reset Password for imported users", () => {
    let args = {};
    let contextMock;
    let resolveInfo;

    const roleMock = jest.fn();
    const auth0 = {
      changePassword: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          role: roleMock,
          email: "email@email.com",
          market: { domain: "en" },
          company: {
            ...company
          },
          can: userCanMock
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

    it("an installer shouldn't be able to reset password imported users", async () => {
      userCanMock.mockImplementationOnce(() => false);
      roleMock.mockReturnValueOnce("INSTALLER");
      try {
        await resetPasswordImportedUsers(
          null,
          args,
          contextMock,
          resolveInfo,
          auth0
        );
      } catch (error) {
        expect(error.message).toEqual(
          "you must be an admin to reset passwords"
        );
      }
    });

    it("a super admin should be able to reset password imported users", async () => {
      userCanMock.mockImplementationOnce(() => true);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, email: "email1@email.com" },
          { id: 2, email: "email2@email.com" }
        ]
      });

      await resetPasswordImportedUsers(
        null,
        args,
        contextMock,
        resolveInfo,
        auth0
      );

      expect(mockQuery.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "SELECT * FROM account WHERE migration_id IS NOT NULL AND migrated_to_auth0 IS NOT true ORDER BY id",
            Array [],
          ],
          Array [
            "UPDATE account SET migrated_to_auth0 = true WHERE id = ANY($1)",
            Array [
              Array [
                1,
                2,
              ],
            ],
          ],
        ]
      `);
      expect(auth0.changePassword).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "email1@email.com",
            ],
            Array [
              "email2@email.com",
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": undefined,
            },
            Object {
              "type": "return",
              "value": undefined,
            },
          ],
        }
      `);
    });

    it("a super admin should be able to reset password imported users for a given market", async () => {
      userCanMock.mockImplementationOnce(() => true);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, email: "email1@email.com" },
          { id: 2, email: "email2@email.com" }
        ]
      });

      await resetPasswordImportedUsers(
        null,
        { input: { market: "en" } },
        contextMock,
        resolveInfo,
        auth0
      );
      expect(mockQuery.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "
              SELECT account.* FROM account
                JOIN market ON market.id = account.market_id
                WHERE migration_id IS NOT NULL AND migrated_to_auth0 IS NOT true AND market.domain = $1 ORDER BY account.id
              ",
            Array [
              "en",
            ],
          ],
          Array [
            "UPDATE account SET migrated_to_auth0 = true WHERE id = ANY($1)",
            Array [
              Array [
                1,
                2,
              ],
            ],
          ],
        ]
      `);
      expect(auth0.changePassword).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "email1@email.com",
            ],
            Array [
              "email2@email.com",
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": undefined,
            },
            Object {
              "type": "return",
              "value": undefined,
            },
          ],
        }
      `);
    });
  });
});
