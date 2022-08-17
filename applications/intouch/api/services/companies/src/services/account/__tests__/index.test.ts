process.env.FRONTEND_URL = "intouch.dddev.io";
process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.APP_ENV = "dev";
process.env.AUTH0_API_DOMAIN = "AUTH0_API_DOMAIN";

import {
  completeInvitation,
  createAccount,
  invite,
  updateAccount,
  resetPasswordImportedUsers,
  resetPassword,
  validateSignupUser,
  deleteInvitedUser
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
const mockAuth0ChangePassword = jest.fn();
const mockCreateResetPasswordTicket = jest.fn();
const mockClientGateway = jest.fn();
const mockUploadFileByStream = jest.fn();
const mockDeleteFile = jest.fn();
const loggerError = jest.fn();
const mockGetAccessToken = jest.fn();
const loggerInfo = jest.fn();

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

const axiosSpy = jest.fn();
jest.mock("axios", () => (params) => axiosSpy(params));

const logger = () => ({
  error: loggerError,
  info: loggerInfo
});

describe("Account", () => {
  let args;
  let pool;
  let resolveInfo;
  let queryGraphileBuilder;

  const userCanMock = jest.fn();
  const userTermsToAccept = jest.fn();
  const auth0 = {
    updateUser: mockAuth0Update,
    createResetPasswordTicket: mockCreateResetPasswordTicket,
    getUserByEmail: mockAuth0GetUserByEmail,
    createUser: mockAuth0CreateUser,
    changePassword: mockAuth0ChangePassword,
    getAccessToken: mockGetAccessToken
  };
  const queryBuilder = () => ({
    where: () => {}
  });
  const build = {
    pgSql: {
      fragment: (args) => queryBuilder,
      value: (args) => {}
    }
  };
  const argsFactory = (input = null, patch = null) => ({
    input: {
      patch: { ...patch },
      ...input
    }
  });
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
    logger,
    storageClient: {
      uploadFileByStream: mockUploadFileByStream,
      deleteFile: mockDeleteFile
    }
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

    queryGraphileBuilder = {
      where: jest.fn()
    };

    args = {
      input: {
        account: { role: "COMPANY_ADMIN" },
        marketCode: "en"
      }
    };

    resolveInfo = {
      graphile: {
        selectGraphQLResultFromTable: jest.fn((_, callback) => {
          callback(_, queryGraphileBuilder);
          return [{}];
        }),
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
        args = argsFactory({ id: 2 }, { role: "COMPANY_ADMIN" });

        (mailerSrv.sendMessageWithTemplate as jest.Mock).mockResolvedValueOnce(
          {}
        );

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "INSTALLER" }]
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, domain: undefined }]
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
            accountId: 2,
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
        args = argsFactory({ id: 2 }, { role: "INSTALLER" });

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
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, domain: "en" }]
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
            accountId: 2,
            email: "email@email.co.uk",
            role: "installer",
            firstname: "Name"
          }
        );
      });

      it("should thrown an error if last admin", async () => {
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

    describe("Role extended", () => {
      it("should throw an error if the last admin", async () => {
        contextMock.user.can = () => false;
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

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "COMPANY_ADMIN" }]
          }));

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
      it("should throw an error if unauthorized INSTALLER", async () => {
        contextMock.user.can = () => false;
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

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "INSTALLER" }]
          }));

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
          expect(error.message).toEqual("unauthorized");
        }
      });
      it("should throw an error if unauthorized MARKET_ADMIN", async () => {
        contextMock.user.can = () => false;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "MARKET_ADMIN"
            }
          }
        };

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "MARKET_ADMIN" }]
          }));

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
          expect(error.message).toEqual("unauthorized");
        }
      });
      it("should throw an error if unauthorized SUPER_ADMIN", async () => {
        contextMock.user.can = () => false;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "SUPER_ADMIN"
            }
          }
        };

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "SUPER_ADMIN" }]
          }));

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
          expect(error.message).toEqual("unauthorized");
        }
      });
      it("case with removed photo", async () => {
        contextMock.user.can = () => true;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER",
              shouldRemovePhoto: true
            }
          }
        };

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ photo: "photo" }]
          }));

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
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });
      it("case with uploaded photo", async () => {
        contextMock.user.can = () => true;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER",
              photoUpload: "https://photo"
            }
          }
        };

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ photo: "photo" }]
          }));

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
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });
      it("case with status", async () => {
        contextMock.user.can = () => true;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER",
              status: "SUSPENDED"
            }
          }
        };

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockResolvedValueOnce({}) // set user
          .mockResolvedValueOnce({}) // set user
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "COMPANY_ADMIN", email: "test@mail.me" }]
          }));

        mockAuth0GetUserByEmail.mockResolvedValueOnce({
          user_id: 1
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
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });
      it("act in case upload photo process failure", async () => {
        contextMock.user.can = () => true;
        contextMock.user.company = {
          id: 1
        };
        args = {
          input: {
            id: 2,
            patch: {
              role: "INSTALLER",
              photoUpload: "https://photo"
            }
          }
        };

        mockUploadFileByStream.mockImplementation(() => {
          throw new Error();
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
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });
      it("act in case missing user company", async () => {
        contextMock.user.can = () => false;
        contextMock.user.company = undefined;
        args = argsFactory({ id: 2 }, { role: "INSTALLER" });

        mockQuery
          .mockImplementationOnce(() => ({
            rows: []
          }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 2, role: "COMPANY_ADMIN" }]
          }));

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

      expect(queryGraphileBuilder.where).toBeCalledTimes(1);
      expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
        {
          ...contextMock,
          user: {
            ...contextMock.user,
            market: { domain: "domain", sendMailbox: "send_mailbox" },
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
    it("Should fail in case of API failure", async () => {
      args.input.account.role = "INSTALLER";
      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1 }
      });

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValue([{}]);

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({}) // set user
        .mockResolvedValueOnce({ rows: [] }) // get company
        .mockImplementation(() => {
          throw new Error("Error creating a user");
        })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      await expect(
        createAccount(mockResolve, null, args, contextMock, resolveInfo)
      ).rejects.toThrowError("Error creating a user");
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
          selectGraphQLResultFromTable: jest.fn((_, callback) => {
            callback(_, queryGraphileBuilder);
            return [{}];
          }),
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

    it("should receive an error if the invitee is part of a company", async () => {
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
        expect(error.message).toEqual("errorAlreadyMember");
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
        protocol: "https",
        clientGateway: mockClientGateway
      };

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
              company_id: 1,
              name: "company name",
              tier: "T2"
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

      mockClientGateway.mockImplementationOnce(() => ({
        data: {
          tierBenefitCollection: {
            items: [
              {
                shortDescription: "shortDescription"
              }
            ]
          }
        }
      }));

      await completeInvitation(
        null,
        args,
        contextMock,
        resolveInfo,
        auth0,
        build
      );
      expect(queryGraphileBuilder.where).toBeCalledTimes(1);
      expect(mailerSrv.sendMessageWithTemplate).toHaveBeenNthCalledWith(
        1,
        {
          ...contextMock,
          user: {
            ...contextMock.user,
            market: { domain: "domain", sendMailbox: "send_mailbox" },
            id: 1
          }
        },
        "ACCOUNT_ACTIVATED",
        {
          accountId: 1,
          email: "email",
          firstname: "first_name",
          marketUrl: `https://dev-domain.intouch.dddev.io`
        }
      );
      expect(mailerSrv.sendMessageWithTemplate).toHaveBeenNthCalledWith(
        2,
        {
          ...contextMock
        },
        "TEAM_JOINED",
        {
          email: "email",
          firstname: "first_name",
          accountId: 1,
          company: "company name",
          tier: "T2",
          tierBenefitsShortDescription: "shortDescription"
        }
      );

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });

    it("should complete an invitation with additional checks", async () => {
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
        protocol: "https",
        clientGateway: mockClientGateway
      };

      resolveInfo.graphile.selectGraphQLResultFromTable.mockResolvedValueOnce([
        {}
      ]);

      mockAuth0GetUserByEmail.mockImplementationOnce(() => ({
        user_metadata: undefined
      }));

      mockRootQuery
        // invitation
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              market_id: 1,
              company_id: 1,
              name: "company name",
              tier: "T2"
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

      mockClientGateway.mockImplementationOnce(() => ({
        data: {
          tierBenefitCollection: {
            items: [
              {
                shortDescription: undefined
              }
            ]
          }
        }
      }));

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

    it("should not complete an invitation if invitee has not an invite", async () => {
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
        protocol: "https",
        clientGateway: mockClientGateway
      };

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
          rows: []
        });

      await expect(
        completeInvitation(null, args, contextMock, resolveInfo, auth0, build)
      ).rejects.toThrow("errorInvitationNotFound");
    });

    it("should not complete an invitation if invitee has a company", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        user: {
          email: "email@email.com",
          company: {
            id: 1
          }
        },
        pgClient: { query: mockQuery },
        pgRootPool: { query: mockRootQuery },
        logger,
        protocol: "https",
        clientGateway: mockClientGateway
      };

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
              company_id: 1,
              name: "company name",
              tier: "T2"
            }
          ]
        });

      await expect(
        completeInvitation(null, args, contextMock, resolveInfo, auth0, build)
      ).rejects.toThrow("errorAlreadyMember");
    });

    it("should not complete an invitation if auth0 fails", async () => {
      const args = {
        companyId: 1
      };

      contextMock = {
        user: {
          email: "email@email.com",
          company: {
            id: 1
          }
        },
        pgClient: { query: mockQuery },
        pgRootPool: { query: mockRootQuery },
        logger,
        protocol: "https",
        clientGateway: mockClientGateway
      };

      mockAuth0GetUserByEmail.mockResolvedValueOnce(null);

      await expect(
        completeInvitation(null, args, contextMock, resolveInfo, auth0, build)
      ).rejects.toThrow("User missing in auth0, please contact the support");
    });

    it("should be able to send invitation for existing user", async () => {
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
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => ({
          rows: [{ id: 2, first_name: "First name value" }]
        }));

      await invite(null, args, contextMock, resolveInfo, auth0);

      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("should be able to send invitation for new user", async () => {
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
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              role: "INSTALLER"
            }
          ]
        })
        .mockResolvedValueOnce({
          rows: []
        });

      mockQuery
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => ({
          rows: [{ id: 2, first_name: "First name value" }]
        }));

      await invite(null, args, contextMock, resolveInfo, auth0);

      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("check auth0 undefined value", async () => {
      contextMock.user.can = () => true;

      mockAuth0GetUserByEmail.mockResolvedValueOnce(null);
      mockAuth0CreateUser.mockResolvedValueOnce(undefined);
      mockCreateResetPasswordTicket.mockResolvedValueOnce({
        ticket: "my-ticket"
      });

      mockRootQuery
        // get user
        .mockResolvedValueOnce({ rows: [] });

      mockQuery
        // insert invitation
        .mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await invite(null, args, contextMock, resolveInfo, auth0);
    });
  });

  describe("Invitation other cases", () => {
    let args;
    let contextMock;
    let resolveInfo;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      args = {
        input: {
          firstName: "firstName",
          lastName: "lastName",
          role: "INSTALLER"
        }
      };

      contextMock = {
        user: {
          sub: "user-sub",
          id: null,
          role: "COMPANY_ADMIN",
          email: "email@email.com",
          market: { domain: "en" },
          company: {
            ...company
          },
          can: userCanMock.mockImplementationOnce(() => true)
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

    it("shouldn't be able to invite a user if email is empty", async () => {
      userCanMock.mockImplementationOnce(() => false);
      try {
        await invite(null, args, contextMock, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual("email missing");
      }
    });
    it("should cut emails length to be invited", async () => {
      contextMock.user.can = () => true;
      args.input.emails = Array(12).fill("email");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const invitee of args.input.emails) {
        mockAuth0CreateUser.mockResolvedValueOnce({
          user_id: "auth0|user-id"
        });
        mockAuth0GetUserByEmail.mockResolvedValueOnce(null);
        mockCreateResetPasswordTicket.mockResolvedValueOnce({
          ticket: "my-ticket"
        });

        mockRootQuery
          // get user
          .mockResolvedValueOnce({ rows: [] });

        mockQuery
          // insert invitation
          .mockResolvedValueOnce({ rows: [{ id: 1 }] });
      }

      await invite(null, args, contextMock, resolveInfo, auth0);
      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.emails[0]);
    });
  });

  describe("Reset Password for imported users", () => {
    const args = {};
    let contextMock;
    let resolveInfo;

    const roleMock = jest.fn();
    const auth0 = {
      changePassword: mockAuth0ChangePassword
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

    it("a super admin should fails password reset for imported users", async () => {
      userCanMock.mockImplementationOnce(() => true);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, email: "email1@email.com" },
          { id: null, email: undefined }
        ]
      });

      mockAuth0ChangePassword.mockImplementation(() => {
        throw new Error();
      });

      await resetPasswordImportedUsers(
        null,
        args,
        contextMock,
        resolveInfo,
        auth0
      );
      expect(mockAuth0ChangePassword).toHaveBeenCalledTimes(2);
    });
  });

  describe("Reset Password", () => {
    let contextMock;
    let resolveInfo;

    const roleMock = jest.fn();
    const auth0 = {
      changePassword: mockAuth0ChangePassword
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

    it("super admin should be able to reset password", async () => {
      userCanMock.mockImplementationOnce(() => true);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, email: "email1@email.com" },
          { id: 2, email: "email2@email.com" }
        ]
      });

      await resetPassword(
        null,
        { input: { market: "en" } },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(auth0.changePassword).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "email@email.com",
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": undefined,
            },
          ],
        }
      `);
    });
    it("should return error in case of auth0 failure", async () => {
      userCanMock.mockImplementationOnce(() => false);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");

      mockAuth0ChangePassword.mockImplementation(() => {
        throw new Error();
      });

      await resetPassword(
        null,
        { input: { market: "en" } },
        contextMock,
        resolveInfo,
        auth0
      );
      expect(mockAuth0ChangePassword).toBeCalledWith("email@email.com");
    });
  });

  describe("validateSignupUser", () => {
    const email = "test@test.com";
    const executeGetAccessToken = () =>
      mockGetAccessToken.mockReturnValueOnce({ access_token: "access_token" });

    it("positive case", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [{ email_verified: true }] });
      const response = await validateSignupUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe(true);
      expect(axiosSpy).toHaveBeenCalledWith({
        method: "GET",
        url: `https://AUTH0_API_DOMAIN/api/v2/users-by-email?email=${encodeURIComponent(
          email
        )}`,
        headers: { Authorization: `Bearer access_token` }
      });
    });

    it("when email_verified return false", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [{ email_verified: false }] });
      const response = await validateSignupUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe(false);
    });

    it("when no user found", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [] });
      const response = await validateSignupUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe(true);
    });

    it("should throw an error if getAccessToken fails", async () => {
      const errorMessage = "get Token Error";
      mockGetAccessToken.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        validateSignupUser(null, { email }, contextMock, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to validate auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios fails", async () => {
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        validateSignupUser(null, { email }, contextMock, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to validate auth0 user: ${email}, Error: ${errorMessage}`
      );
    });
  });

  describe("deleteInvitedUser", () => {
    const email = "test@test.com";
    const executeGetAccessToken = () =>
      mockGetAccessToken.mockReturnValueOnce({ access_token: "access_token" });

    it("positive case", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: [{ email_verified: false, user_id: 1 }]
      });
      mockRootQuery.mockResolvedValueOnce({ rows: [] });
      const response = await deleteInvitedUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe("ok");
      expect(loggerInfo).toHaveBeenCalledTimes(1);
      expect(loggerInfo).toHaveBeenCalledWith(
        `Successfully deleted auth0 user: ${email}`
      );
      expect(axiosSpy).toHaveBeenNthCalledWith(1, {
        method: "GET",
        url: `https://AUTH0_API_DOMAIN/api/v2/users-by-email?email=${encodeURIComponent(
          email
        )}`,
        headers: { Authorization: `Bearer access_token` }
      });
      expect(axiosSpy).toHaveBeenNthCalledWith(2, {
        method: "DELETE",
        url: `https://AUTH0_API_DOMAIN/api/v2/users/1`,
        headers: { Authorization: `Bearer access_token` }
      });
    });

    it("when there is an invitation in db", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: [{ email_verified: false, user_id: 1 }]
      });
      mockRootQuery.mockResolvedValueOnce({
        rows: [{ id: 1, market_id: 1, company_id: 1 }]
      });
      const response = await deleteInvitedUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe("ok");
      expect(loggerInfo).toHaveBeenCalledTimes(2);
      expect(mockRootQuery).toHaveBeenCalledWith(
        "DELETE FROM invitation WHERE invitee = $1 RETURNING *",
        [email]
      );
      expect(loggerInfo).toHaveBeenCalledWith(
        `Deleted invitation with email: ${email}`
      );
    });

    it("when email_verified is true", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: [{ email_verified: true, user_id: 1 }]
      });
      const response = await deleteInvitedUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe("fail");
      expect(loggerInfo).toHaveBeenCalledWith(
        `Auth0 user has been verified: ${email}`
      );
    });

    it("when no user found", async () => {
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: []
      });
      const response = await deleteInvitedUser(
        null,
        { email },
        contextMock,
        resolveInfo,
        auth0
      );

      expect(response).toBe("fail");
      expect(loggerInfo).toHaveBeenCalledWith(`Unable to find user: ${email}`);
    });

    it("should throw an error if getAccessToken fails", async () => {
      const errorMessage = "get Token Error";
      mockGetAccessToken.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, contextMock, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios get user fails", async () => {
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, contextMock, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios delete user fails", async () => {
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy
        .mockReturnValueOnce({
          data: [{ email_verified: false, user_id: 1 }]
        })
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, contextMock, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });
  });
});
