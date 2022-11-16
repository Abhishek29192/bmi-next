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
import * as rewardRecord from "../../rewardRecord";

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
jest.mock("../../rewardRecord", () => ({
  addRewardRecord: jest.fn().mockImplementation(() => Promise.resolve())
}));

const axiosSpy = jest.fn();
jest.mock("axios", () => (params) => axiosSpy(params));

const logger = () => ({
  error: loggerError,
  info: loggerInfo
});

describe("Account", () => {
  let args;
  let pool;

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
  const build = {
    pgSql: {
      fragment: (args) => args.join(""),
      value: (args) => args
    }
  };
  const queryGraphileBuilder = {
    where: jest.fn()
  };
  const resolveInfo = {
    graphile: {
      selectGraphQLResultFromTable: (alias, callback) => {
        return callback(alias, queryGraphileBuilder);
      },
      build
    }
  };
  const argsFactory = (input = null, patch = null) => ({
    input: {
      patch: { ...patch },
      ...input
    }
  });
  const contextMock: any = ({ user = {}, ...data } = {}) => ({
    user: {
      sub: "user-sub",
      id: null,
      [`${process.env.AUTH0_NAMESPACE}/terms_to_accept`]: userTermsToAccept,
      can: userCanMock,
      company: { id: 1 },
      market: {
        domain: "en"
      },
      ...user
    },
    protocol: "https",
    pubSub: mockPubSub,
    clientGateway: mockClientGateway,
    pgClient: { query: mockQuery },
    pgRootPool: { query: mockRootQuery },
    logger,
    storageClient: {
      uploadFileByStream: mockUploadFileByStream,
      deleteFile: mockDeleteFile
    },
    ...data
  });

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
    queryGraphileBuilder.where.mockResolvedValue([]);
    (mailerSrv.sendMessageWithTemplate as jest.Mock).mockReturnValue({});
  });

  describe("Update", () => {
    describe("Role", () => {
      it("should resolve if a company admin promote a installer", async () => {
        const context = contextMock();
        context.user.can.mockReturnValueOnce(false).mockReturnValueOnce(true);
        args = argsFactory({ id: 2 }, { role: "COMPANY_ADMIN" });

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
          context,
          resolveInfo,
          auth0
        );

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith(context.clientGateway, {
          userid: "123456",
          level: 4
        });
        expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
          context,
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
        const context = contextMock();
        (context.user.can as jest.Mock)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);
        args = argsFactory({ id: 2 }, { role: "INSTALLER" });

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
          context,
          resolveInfo,
          auth0
        );

        expect(mockResolve).toBeCalled();
        expect(trainingSrv.updateUser).toBeCalledWith(context.clientGateway, {
          userid: "123456",
          level: 6
        });
        expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
          context,
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
        const context = contextMock({ user: { can: () => true } });
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
            context,
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
        const context = contextMock({ user: { can: () => false } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(error.message).toEqual("last_company_admin");
        }
      });

      it("should throw an error if unauthorized INSTALLER", async () => {
        const context = contextMock({ user: { can: () => false } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(error.message).toEqual("unauthorized");
        }
      });

      it("should throw an error if unauthorized MARKET_ADMIN", async () => {
        const context = contextMock({ user: { can: () => false } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(error.message).toEqual("unauthorized");
        }
      });

      it("should throw an error if unauthorized SUPER_ADMIN", async () => {
        const context = contextMock({ user: { can: () => false } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(error.message).toEqual("unauthorized");
        }
      });

      it("case with removed photo", async () => {
        const context = contextMock({ user: { can: () => true } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });

      it("case with uploaded photo", async () => {
        const context = contextMock({ user: { can: () => true } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });

      it("case with status", async () => {
        const context = contextMock({ user: { can: () => true } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });

      it("act in case upload photo process failure", async () => {
        const context = contextMock({ user: { can: () => true } });
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
            context,
            resolveInfo,
            auth0
          );
        } catch (error) {
          expect(mockQuery.mock.calls).toMatchSnapshot();
        }
      });

      it("act in case missing user company", async () => {
        const context = contextMock({
          user: { can: () => false, company: undefined }
        });
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
            context,
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
        const context = contextMock();
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
          context,
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
    const context = contextMock();

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

      await createAccount(mockResolve, null, args, context, resolveInfo);

      expect(queryGraphileBuilder.where).toBeCalledTimes(1);
      expect(mailerSrv.sendMessageWithTemplate).toBeCalledWith(
        {
          ...context,
          user: {
            ...context.user,
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

      await createAccount(mockResolve, null, args, context, resolveInfo);

      expect(mockQuery.mock.calls).toMatchSnapshot();
    });

    it("Should fail in case of API failure", async () => {
      args.input.account.role = "INSTALLER";
      mockResolve.mockResolvedValueOnce({
        data: { $account_id: 1 }
      });

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
        createAccount(mockResolve, null, args, context, resolveInfo)
      ).rejects.toThrowError("Error creating a user");
    });
  });

  describe("Invitation", () => {
    const args = {
      input: {
        emails: ["email"],
        firstName: "firstName",
        lastName: "lastName",
        role: "INSTALLER",
        personalNote: "personalNote"
      }
    };

    it("shouldn't be able to invite a user if installer", async () => {
      const context = contextMock({ user: { role: "INSTALLER" } });
      userCanMock.mockImplementationOnce(() => false);
      try {
        await invite(null, args, context, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual(
          "you must be an admin to invite other users"
        );
      }
    });

    it("should invite a user sending a change password email if not exists", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });

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

      await invite(null, args, context, resolveInfo, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.emails[0]);
      expect(mockAuth0CreateUser).toBeCalledWith({
        email: args.input.emails[0],
        connection: "Username-Password-Authentication",
        email_verified: false,
        password: "Gj$1Password",
        verify_email: false,
        user_metadata: {
          intouch_role: args.input.role,
          market: context.user.market.domain,
          first_name: args.input.firstName,
          last_name: args.input.lastName
        }
      });
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(
        (mailerSrv.sendMessageWithTemplate as jest.Mock).mock.calls
      ).toMatchSnapshot();
    });

    it("should invite a user sending complete invitation email if exists", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });
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
        // get company_member
        .mockResolvedValueOnce({ rows: [] });

      await invite(null, args, context, resolveInfo, auth0);

      expect(mockAuth0GetUserByEmail).toBeCalledWith(args.input.emails[0]);
      expect(mockCreateResetPasswordTicket).toHaveBeenCalledTimes(0);
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(
        (mailerSrv.sendMessageWithTemplate as jest.Mock).mock.calls
      ).toMatchSnapshot();
    });

    it("should receive an error if the invitee is part of a company", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });

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
        await invite(null, args, context, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual("errorAlreadyMember");
      }
    });

    it("should complete an invitation", async () => {
      const args = {
        companyId: 1
      };
      const user = {
        id: 1,
        market_id: 1,
        company_id: args.companyId,
        name: "company name",
        tier: "T2",
        sender_account_id: 1
      };
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: {} }
      });

      mockAuth0GetUserByEmail.mockImplementationOnce(() => ({
        user_metadata: {
          first_name: "Name",
          last_name: "Name",
          intouch_role: "installer"
        }
      }));

      mockRootQuery
        .mockResolvedValueOnce({
          rows: [user]
        })
        .mockResolvedValueOnce({
          rows: [{ ...user, status: "ACCEPTED" }]
        })
        .mockResolvedValueOnce({
          rows: []
        });

      mockQuery
        .mockResolvedValueOnce({}) // savepoint
        .mockResolvedValueOnce({
          rows: [
            { id: 1, market_id: 1, email: "email", first_name: "first_name" }
          ]
        }) // account
        .mockResolvedValueOnce({}) // config
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: context.user.market.domain
            }
          ]
        }) // market
        .mockResolvedValueOnce({
          rows: [{ id: 2, account_id: 1, market_id: 1, company_id: 1 }]
        }) // company_member
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: context.user.market.domain
            }
          ]
        }); // markets

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

      await completeInvitation(null, args, context, resolveInfo, auth0, build);

      expect(mailerSrv.sendMessageWithTemplate).toHaveBeenNthCalledWith(
        1,
        {
          ...context,
          user: {
            ...context.user,
            market: {
              domain: context.user.market.domain,
              sendMailbox: "send_mailbox"
            },
            id: 1
          }
        },
        "ACCOUNT_ACTIVATED",
        {
          accountId: 1,
          email: "email",
          firstname: "first_name",
          marketUrl: `${context.protocol}://dev-${context.user.market.domain}.intouch.dddev.io`
        }
      );
      expect(mailerSrv.sendMessageWithTemplate).toHaveBeenNthCalledWith(
        2,
        {
          ...context
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
      expect(queryGraphileBuilder.where).toBeCalledTimes(1);
      expect(rewardRecord.addRewardRecord).toHaveBeenCalledWith(
        null,
        {
          input: {
            accountId: 1,
            rewardCategory: "rc1"
          }
        },
        context
      );
      expect(mockQuery.mock.calls).toMatchSnapshot();
    });

    it("should complete an invitation with additional checks", async () => {
      const args = {
        companyId: 1
      };
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: {} }
      });
      const user = {
        id: 1,
        market_id: 1,
        company_id: 1,
        name: "company name",
        tier: "T2"
      };

      mockAuth0GetUserByEmail.mockImplementationOnce(() => ({
        user_metadata: undefined
      }));

      mockRootQuery
        // invitation
        .mockResolvedValueOnce({
          rows: [user]
        })
        .mockResolvedValueOnce({
          rows: [{ ...user, status: "ACCEPTED" }]
        })
        .mockResolvedValueOnce({
          rows: []
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
        }) // company_member
        .mockResolvedValueOnce({
          rows: [
            {
              send_mailbox: "send_mailbox",
              domain: "domain"
            }
          ]
        }); //market

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

      await completeInvitation(null, args, context, resolveInfo, auth0, build);
      expect(mockQuery.mock.calls).toMatchSnapshot();
      expect(rewardRecord.addRewardRecord).toHaveBeenCalledTimes(1);
    });

    it("should rollback an invitation if a query throw an error", async () => {
      const args = {
        companyId: 1
      };
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: {} }
      });

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
          context,
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
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: {} }
      });

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
        completeInvitation(null, args, context, resolveInfo, auth0, build)
      ).rejects.toThrow("errorInvitationNotFound");
    });

    it("should not complete an invitation if invitee has a company", async () => {
      const args = {
        companyId: 1
      };
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: { id: 1 } }
      });

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
        completeInvitation(null, args, context, resolveInfo, auth0, build)
      ).rejects.toThrow("errorAlreadyMember");
    });

    it("should not complete an invitation if auth0 fails", async () => {
      const args = {
        companyId: 1
      };
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true, company: { id: 1 } }
      });

      mockAuth0GetUserByEmail.mockResolvedValueOnce(null);

      await expect(
        completeInvitation(null, args, context, resolveInfo, auth0, build)
      ).rejects.toThrow("User missing in auth0, please contact the support");
    });

    it("should be able to send invitation for existing user", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });

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

      await invite(null, args, context, resolveInfo, auth0);

      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("should be able to send invitation for new user", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });
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

      await invite(null, args, context, resolveInfo, auth0);

      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("check auth0 undefined value", async () => {
      const context = contextMock({
        user: { role: "INSTALLER", can: () => true }
      });

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

      await invite(null, args, context, resolveInfo, auth0);
    });
  });

  describe("Invitation other cases", () => {
    const args = {
      input: {
        firstName: "firstName",
        lastName: "lastName",
        role: "INSTALLER"
      }
    };

    it("shouldn't be able to invite a user if email is empty", async () => {
      const context = contextMock({
        user: { role: "COMPANY_ADMIN", emails: [] }
      });
      userCanMock.mockImplementationOnce(() => true);
      try {
        await invite(null, args, context, resolveInfo, auth0);
      } catch (error) {
        expect(error.message).toEqual("email missing");
      }
    });

    it("should cut emails length to be invited", async () => {
      const context = contextMock({
        user: { role: "COMPANY_ADMIN", can: () => true }
      });
      const emails = Array(12).fill("email");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const invitee of emails) {
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

      await invite(
        null,
        { input: { ...args.input, emails } },
        context,
        resolveInfo,
        auth0
      );
      expect(mockAuth0GetUserByEmail).toBeCalledWith(emails[0]);
    });
  });

  describe("Reset Password for imported users", () => {
    const roleMock = jest.fn();
    const args = {};
    const context = contextMock({
      user: { role: roleMock, can: userCanMock, id: null }
    });
    const auth0 = {
      changePassword: mockAuth0ChangePassword
    };
    let resolveInfo;

    it("an installer shouldn't be able to reset password imported users", async () => {
      userCanMock.mockImplementationOnce(() => false);
      roleMock.mockReturnValueOnce("INSTALLER");
      try {
        await resetPasswordImportedUsers(
          null,
          args,
          context,
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

      await resetPasswordImportedUsers(null, args, context, resolveInfo, auth0);

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
        context,
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

      await resetPasswordImportedUsers(null, args, context, resolveInfo, auth0);
      expect(mockAuth0ChangePassword).toHaveBeenCalledTimes(2);
    });
  });

  describe("Reset Password", () => {
    const roleMock = jest.fn();
    const context = contextMock({
      user: { role: roleMock, can: userCanMock, id: null }
    });
    let resolveInfo;

    const auth0 = {
      changePassword: mockAuth0ChangePassword
    };

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
        context,
        resolveInfo,
        auth0
      );

      expect(auth0.changePassword).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              undefined,
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
      const context = contextMock({ user: { email: "email@email.com" } });
      userCanMock.mockImplementationOnce(() => false);
      roleMock.mockReturnValueOnce("SUPER_ADMIN");

      mockAuth0ChangePassword.mockImplementation(() => {
        throw new Error();
      });

      await resetPassword(
        null,
        { input: { market: "en" } },
        context,
        resolveInfo,
        auth0
      );
      expect(mockAuth0ChangePassword).toBeCalledWith(context.user.email);
    });
  });

  describe("validateSignupUser", () => {
    const email = "test@test.com";
    const executeGetAccessToken = () =>
      mockGetAccessToken.mockReturnValueOnce({ access_token: "access_token" });

    it("positive case", async () => {
      const context = contextMock();
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [{ email_verified: true }] });
      const response = await validateSignupUser(
        null,
        { email },
        context,
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
      const context = contextMock();
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [{ email_verified: false }] });
      const response = await validateSignupUser(
        null,
        { email },
        context,
        resolveInfo,
        auth0
      );

      expect(response).toBe(false);
    });

    it("when no user found", async () => {
      const context = contextMock();
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({ data: [] });
      const response = await validateSignupUser(
        null,
        { email },
        context,
        resolveInfo,
        auth0
      );

      expect(response).toBe(true);
    });

    it("should throw an error if getAccessToken fails", async () => {
      const context = contextMock();
      const errorMessage = "get Token Error";
      mockGetAccessToken.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        validateSignupUser(null, { email }, context, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to validate auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios fails", async () => {
      const context = contextMock();
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        validateSignupUser(null, { email }, context, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to validate auth0 user: ${email}, Error: ${errorMessage}`
      );
    });
  });

  describe("deleteInvitedUser", () => {
    const context = contextMock();
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
        context,
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
      const context = contextMock();
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
        context,
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
      const context = contextMock();
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: [{ email_verified: true, user_id: 1 }]
      });
      const response = await deleteInvitedUser(
        null,
        { email },
        context,
        resolveInfo,
        auth0
      );

      expect(response).toBe("fail");
      expect(loggerInfo).toHaveBeenCalledWith(
        `Auth0 user has been verified: ${email}`
      );
    });

    it("when no user found", async () => {
      const context = contextMock();
      executeGetAccessToken();
      axiosSpy.mockReturnValueOnce({
        data: []
      });
      const response = await deleteInvitedUser(
        null,
        { email },
        context,
        resolveInfo,
        auth0
      );

      expect(response).toBe("fail");
      expect(loggerInfo).toHaveBeenCalledWith(`Unable to find user: ${email}`);
    });

    it("should throw an error if getAccessToken fails", async () => {
      const context = contextMock();
      const errorMessage = "get Token Error";
      mockGetAccessToken.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, context, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios get user fails", async () => {
      const context = contextMock();
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, context, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });

    it("should throw an error if axios delete user fails", async () => {
      const context = contextMock();
      const errorMessage = "get User Error";
      executeGetAccessToken();
      axiosSpy
        .mockReturnValueOnce({
          data: [{ email_verified: false, user_id: 1 }]
        })
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        deleteInvitedUser(null, { email }, context, resolveInfo, auth0)
      ).rejects.toThrowError("fail");
      expect(loggerError).toHaveBeenCalledWith(
        `Unable to delete auth0 user: ${email}, Error: ${errorMessage}`
      );
    });
  });
});
