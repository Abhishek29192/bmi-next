import { completeInvitation, createAccount, invite, updateAccount } from "../";
import * as mailerSrv from "../../../services/mailer";
import * as trainingSrv from "../../../services/training";
import { transaction, getDbPool } from "../../../test-utils/db";
import { company } from "../../../fixtures";

const mockPubSub = jest.fn();
const mockQuery = jest.fn();
const mockRootQuery = jest.fn();
const mockResolve = jest.fn();
const mockAuth0Update = jest.fn();
const mockAuth0GetUserByEmail = jest.fn();
const mockAuth0CreateUser = jest.fn();
const mockCreateResetPasswordTicket = jest.fn();

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

process.env.FRONTEND_URL = "intouch.dddev.io";

describe("Account", () => {
  let args;
  let pool;
  let resolveInfo;
  const userCanMock = jest.fn();
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
      can: userCanMock
    },
    pubSub: mockPubSub,
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
      it("should throw an error if an installer try to update the role", async () => {
        const email1 = "joe@email.invalid";
        const email2 = "jane@email.invalid";

        const {
          rows: [installer]
        } = await transaction(
          pool,
          {
            role: "super_admin",
            accountUuid: -1,
            accountEmail: ""
          },
          "insert into account (role, first_name, last_name, email) VALUES($1, $2, $3, $4) RETURNING *",
          ["INSTALLER", "joe", "doe", email1]
        );
        await transaction(
          pool,
          {
            role: "super_admin",
            accountUuid: -1,
            accountEmail: ""
          },
          "insert into account (role, first_name, last_name, email) VALUES($1, $2, $3, $4) RETURNING *",
          ["COMPANY_ADMIN", "jane", "doe", email2]
        );

        try {
          await transaction(
            pool,
            {
              role: "installer",
              accountUuid: installer.id,
              accountEmail: installer.email
            },
            "update account set role=$1",
            ["INSTALLER"]
          );
        } catch (error) {
          expect(error.message).toEqual("permission denied for table account");
        }

        await pool.query("delete from account where email = $1 OR email=$2", [
          email1,
          email2
        ]);
      });

      it("should resolve if a company admin promote a installer", async () => {
        contextMock.user.can = () => true;
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

        (mailerSrv.sendEmailWithTemplate as jest.Mock).mockResolvedValueOnce(
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

        await updateAccount(mockResolve, null, args, contextMock, resolveInfo);

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith({
          userid: "123456",
          level: 4
        });
        expect(mailerSrv.sendEmailWithTemplate).toBeCalledWith(
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

        (mailerSrv.sendEmailWithTemplate as jest.Mock).mockResolvedValueOnce(
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

        await updateAccount(mockResolve, null, args, contextMock, resolveInfo);

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith({
          userid: "123456",
          level: 6
        });
        expect(mailerSrv.sendEmailWithTemplate).toBeCalledWith(
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

        (mailerSrv.sendEmailWithTemplate as jest.Mock).mockResolvedValueOnce(
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
            resolveInfo
          );
        } catch (error) {
          expect(error.message).toEqual("last_company_admin");
        }
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
        logger
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

      expect(mailerSrv.sendEmailWithTemplate).toBeCalledWith(
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
          marketUrl: `https://domain.intouch.dddev.io`
        }
      );
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

      const spy = jest.spyOn(mailerSrv, "sendEmailWithTemplate");

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

      const spy = jest.spyOn(mailerSrv, "sendEmailWithTemplate");

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

      expect(mailerSrv.sendEmailWithTemplate).toBeCalledWith(
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
          marketUrl: `https://domain.intouch.dddev.io`
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
});
