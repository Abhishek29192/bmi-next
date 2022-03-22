import { CreateCompanyInput, UpdateCompanyInput } from "@bmi/intouch-api-types";
import {
  createCompany,
  deleteCompanyMember,
  updateCompany,
  throwUniqueViolationError,
  getCompanyTier
} from "..";
import { sendMessageWithTemplate } from "../../../services/mailer";

jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));

const mockGetDbPoolQuery = jest.fn();
jest.mock("../../../db", () => ({
  getDbPool: () => ({
    query: (...params) => mockGetDbPoolQuery(...params)
  })
}));

describe("Company", () => {
  const resolve = jest.fn();
  const source = {};
  const resolveInfo = {};
  let context;
  const argsFactory = (input = null, patch = null) => ({
    input: {
      patch: { ...patch },
      ...input
    }
  });
  const query = jest.fn();
  const mockClientGateway = jest.fn();
  const errorLogger = jest.fn();
  const OLD_ENV = process.env;
  const mockUploadFileByStream = jest.fn();
  const mockGetPublicFileUrl = jest.fn();
  const mockDeleteFile = jest.fn();
  const mockGetFileNameFromPublicUrl = jest.fn();
  const errorMessage = "error message";
  const uniqueErrorMessage = "throwUniqueViolationError";
  const errorObject = { code: "23505", constraint: uniqueErrorMessage };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    context = {
      pubSub: {},
      logger: () => ({ info: jest.fn(), error: (error) => errorLogger(error) }),
      pgClient: {
        query
      },
      user: {
        role: "COMPANY_ADMIN",
        marketId: 1
      },
      clientGateway: mockClientGateway,
      storageClient: {
        uploadFileByStream: (...params) => mockUploadFileByStream(...params),
        getPublicFileUrl: (fileName) => mockGetPublicFileUrl(fileName),
        deleteFile: (...params) => mockDeleteFile(...params),
        getFileNameFromPublicUrl: (url) => mockGetFileNameFromPublicUrl(url)
      }
    };

    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("company member (deleteCompanyMember)", () => {
    const args = argsFactory({ id: 1 });

    it("shouldn't remove the user if not a member", async () => {
      query.mockImplementationOnce(() => ({ rows: [] }));

      await expect(
        deleteCompanyMember(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("user not in this company");
    });

    it("shouldn't remove the user if company admin", async () => {
      query.mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            company_id: 2,
            role: "COMPANY_ADMIN"
          }
        ]
      }));

      await expect(
        deleteCompanyMember(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("you can remove only installers");
    });

    it("should remove the user from the company and from the projects", async () => {
      query.mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            company_id: 2,
            role: "INSTALLER"
          }
        ]
      }));

      await deleteCompanyMember(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(1);
      expect(query.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "
            SELECT
              account.id,
              account.role,
              account.first_name,
              account.last_name,
              account.email,
              company_member.company_id AS company_id,
              company.name
            FROM
              account
              JOIN company_member ON account.id = company_member.account_id
              JOIN company ON company.id = company_member.company_id
            WHERE
              company_member.id = $1
            ",
            Array [
              1,
            ],
          ],
          Array [
            "SAVEPOINT graphql_mutation",
          ],
          Array [
            "delete from project_member where account_id = $1 returning *",
            Array [
              1,
            ],
          ],
          Array [
            "RELEASE SAVEPOINT graphql_mutation",
          ],
        ]
      `);
    });

    it("throw error when catch any error", async () => {
      query
        .mockImplementationOnce(() => ({
          rows: [
            {
              id: 1,
              company_id: 2,
              role: "INSTALLER"
            }
          ]
        }))
        .mockImplementationOnce(() => Promise.reject(errorMessage));

      await expect(
        deleteCompanyMember(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
      expect(errorLogger).toBeCalledWith(
        `Error removing user with id: ${1} from company ${2}`
      );
      expect(query).toHaveBeenNthCalledWith(
        3,
        "ROLLBACK TO SAVEPOINT graphql_mutation"
      );
      expect(query).toHaveBeenNthCalledWith(
        4,
        "RELEASE SAVEPOINT graphql_mutation"
      );
    });
  });

  describe("createCompany", () => {
    const resolve = jest.fn();
    const source = {};
    const resolveInfo = {};
    const args: { input: CreateCompanyInput } = {
      input: {
        name: "  Company name  ",
        businessType: "MERCHANT",
        status: "NEW",
        taxNumber: "2"
      }
    };

    it("should trim input", async () => {
      await createCompany(resolve, source, args, context, resolveInfo);

      expect(resolve).toHaveBeenCalledWith(
        {},
        {
          input: {
            name: "Company name",
            businessType: "MERCHANT",
            status: "NEW",
            taxNumber: "2"
          }
        },
        context,
        {}
      );
    });

    it("throw error when catch any error", async () => {
      resolve.mockRejectedValue(errorMessage);

      await expect(
        createCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
      expect(errorLogger).toBeCalledWith(
        `Error creating company: ${errorMessage}`
      );
    });

    it("throw error when catch error object", async () => {
      const errorOject = { message: errorMessage };
      resolve.mockRejectedValue(errorOject);

      await expect(
        createCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorOject);
      expect(errorLogger).toBeCalledWith(
        `Error creating company: ${errorOject}`
      );
    });

    it("throw throwUniqueViolationError when error code equal UNIQUE_VIOLATION_ERROR_CODE", async () => {
      resolve.mockRejectedValue(errorObject);

      await expect(
        createCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("errorUniqueViolation");
      expect(errorLogger).toBeCalledWith(
        `Error creating company: ${errorObject}`
      );
    });
  });

  describe("company update", () => {
    it("should send mail", async () => {
      const args: { input: UpdateCompanyInput } = argsFactory({
        id: 1,
        patch: {
          tier: "T2"
        }
      });
      query
        .mockImplementationOnce(() => ({
          rows: [
            {
              id: 1,
              tier: "T1"
            }
          ]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }))
        .mockImplementationOnce(() => ({
          rows: [
            {
              id: 1,
              email: "email",
              first_name: "firstname"
            },
            {
              id: 2,
              email: "email",
              first_name: "firstname"
            }
          ]
        }));

      resolve.mockImplementationOnce(() => ({
        data: {
          name: "",
          business_type: "",
          tax_number: "",
          status: "",
          registered_address_id: ""
        }
      }));
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

      await updateCompany(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
        1,
        context,
        "TIER_ASSIGNED",
        {
          email: "email",
          accountId: 1,
          firstname: "firstname",
          tier: "T2",
          tierBenefitsShortDescription: "shortDescription"
        }
      );
      expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
        2,
        context,
        "TIER_ASSIGNED",
        {
          email: "email",
          accountId: 2,
          firstname: "firstname",
          tier: "T2",
          tierBenefitsShortDescription: "shortDescription"
        }
      );
    });

    it("should upload logo", async () => {
      const uploadedFile = "uploadedFile";
      const args = argsFactory({
        id: 1,
        patch: { logoUpload: uploadedFile }
      });
      process.env.GCP_PUBLIC_BUCKET_NAME = "GCP_PUBLIC_BUCKET_NAME";

      query
        .mockReturnValueOnce({ rows: [{ logo: null }] })
        .mockReturnValue({ rows: [{ id: 1, tier: "T1" }] });
      resolve.mockRejectedValueOnce(errorMessage);
      mockGetPublicFileUrl.mockReturnValue(uploadedFile);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
      expect(mockUploadFileByStream).toBeCalledWith(
        "GCP_PUBLIC_BUCKET_NAME",
        expect.any(String),
        uploadedFile
      );
      expect(mockGetPublicFileUrl).toBeCalledTimes(1);
      expect(query).toHaveBeenNthCalledWith(
        1,
        "select company.logo from company where id = $1",
        [args.input.id]
      );
      expect(resolve).toBeCalledWith(
        source,
        argsFactory(
          { id: 1 },
          { logo: uploadedFile, logoUpload: uploadedFile }
        ),
        context,
        resolveInfo
      );
    });

    it("should remove logo when shouldRemoveLogo is true", async () => {
      const args = argsFactory({
        id: 1,
        patch: {
          logoUpload: false,
          shouldRemoveLogo: true
        }
      });
      query
        .mockReturnValueOnce({ rows: [{ logo: null }] })
        .mockReturnValue({ rows: [{ id: 1, tier: "T1" }] });
      resolve.mockRejectedValueOnce(errorMessage);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
      expect(query).toHaveBeenNthCalledWith(
        1,
        "select company.logo from company where id = $1",
        [args.input.id]
      );
      expect(resolve).toBeCalledWith(
        source,
        argsFactory(args.input, { logo: null }),
        context,
        resolveInfo
      );
    });

    it("should remove googleapis logo", async () => {
      const uploadedFile = "uploadedFile";
      const currentLogoURL = "https://storage.googleapis.com/test";
      const args = argsFactory({
        id: 1,
        patch: { logoUpload: uploadedFile }
      });
      process.env.GCP_PUBLIC_BUCKET_NAME = "GCP_PUBLIC_BUCKET_NAME";

      query
        .mockReturnValueOnce({
          rows: [{ logo: currentLogoURL }]
        })
        .mockReturnValue({ rows: [{ id: 1, tier: "T1" }] });
      resolve.mockRejectedValueOnce(errorMessage);
      mockGetPublicFileUrl.mockReturnValue(uploadedFile);
      mockGetFileNameFromPublicUrl.mockReturnValue(currentLogoURL);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
      expect(mockGetFileNameFromPublicUrl).toBeCalledWith(currentLogoURL);
      expect(mockDeleteFile).toBeCalledWith(
        "GCP_PUBLIC_BUCKET_NAME",
        currentLogoURL
      );
    });

    describe("tier exists in input patch object", () => {
      const args = argsFactory({}, { tier: "T1" });
      const companyName = "Company name";
      const account = (account = null) => ({
        email: "accountEmail",
        id: 1,
        first_name: "first_name",
        ...account
      });

      beforeEach(() => {
        resolve.mockReturnValueOnce({
          data: {
            $status: "NEW",
            $name: companyName,
            $business_type: "MERCHANT",
            $tax_number: "2",
            $registered_address_id: 1
          }
        });
      });

      it("default case", async () => {
        const accountArray = [account()];
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T2" }] })
          .mockReturnValueOnce({ rows: [{}] })
          .mockReturnValueOnce({ rows: accountArray });
        mockClientGateway.mockReturnValue({
          data: {
            tierBenefitCollection: {
              items: [
                {
                  shortDescription: "shortDescription"
                }
              ]
            }
          }
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          1,
          context,
          "TIER_ASSIGNED",
          {
            email: accountArray[0].email,
            accountId: accountArray[0].id,
            firstname: accountArray[0].first_name,
            tier: "T1",
            tierBenefitsShortDescription: "shortDescription"
          }
        );
      });

      it("no companyAdmins found", async () => {
        const accountArray = [];
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T2" }] })
          .mockReturnValueOnce({ rows: [{}] })
          .mockReturnValueOnce({ rows: accountArray });
        mockClientGateway.mockReturnValue({
          data: {
            tierBenefitCollection: {
              items: [
                {
                  shortDescription: "shortDescription"
                }
              ]
            }
          }
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toBeCalledTimes(0);
      });

      it("multiple companyAdmins found", async () => {
        const accountArray = [account(), account({ email: "accountEmail2" })];
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T2" }] })
          .mockReturnValueOnce({ rows: [{}] })
          .mockReturnValueOnce({ rows: accountArray });
        mockClientGateway.mockReturnValue({
          data: {
            tierBenefitCollection: {
              items: [
                {
                  shortDescription: "shortDescription"
                }
              ]
            }
          }
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenCalledTimes(2);
        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          2,
          context,
          "TIER_ASSIGNED",
          {
            email: accountArray[1].email,
            accountId: accountArray[1].id,
            firstname: accountArray[1].first_name,
            tier: "T1",
            tierBenefitsShortDescription: "shortDescription"
          }
        );
      });

      it("tierBenefit returns name", async () => {
        const accountArray = [account()];
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T2" }] })
          .mockReturnValueOnce({ rows: [{}] })
          .mockReturnValueOnce({ rows: accountArray });
        mockClientGateway.mockReturnValue({
          data: {
            tierBenefitCollection: {
              items: [
                {
                  name: "benefitName"
                }
              ]
            }
          }
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          1,
          context,
          "TIER_ASSIGNED",
          {
            email: accountArray[0].email,
            accountId: accountArray[0].id,
            firstname: accountArray[0].first_name,
            tier: "benefitName",
            tierBenefitsShortDescription: ""
          }
        );
      });
    });

    describe("creates company", () => {
      const args = argsFactory();
      const marketAdminEmail = "marketAdminEmail";
      const companyName = "Company name";

      beforeEach(() => {
        context = {
          ...context,
          user: {
            ...context.user,
            email: "userEmail",
            id: 1,
            firstName: "firstName"
          }
        };
        resolve.mockReturnValueOnce({
          data: {
            $status: "NEW",
            $name: companyName,
            $business_type: "MERCHANT",
            $tax_number: "2",
            $registered_address_id: 1
          }
        });
      });

      it("include checking for registeredAddress when creates company", async () => {
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T1" }] })
          .mockReturnValueOnce({
            rows: [
              {
                first_line: "first_line",
                town: "town",
                postcode: "postcode",
                country: "country"
              }
            ]
          })
          .mockReturnValue({});
        mockGetDbPoolQuery.mockReturnValueOnce({
          rows: [{ email: marketAdminEmail }]
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(query).toHaveBeenNthCalledWith(
          2,
          "select address.* from address where address.id = $1",
          [1]
        );
        expect(resolve).toHaveBeenCalledTimes(1);
        expect(mockGetDbPoolQuery).toHaveBeenCalledWith(
          `SELECT * FROM account JOIN market ON market.id = account.market_id WHERE account.role = $1 AND account.market_id = $2`,
          ["MARKET_ADMIN", 1]
        );
      });

      it("send email", async () => {
        const mailBody = {
          accountId: context.user.id,
          firstname: context.user.firstName,
          company: companyName,
          city: "town"
        };
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T1" }] })
          .mockReturnValueOnce({
            rows: [
              {
                first_line: "first_line",
                town: "town",
                postcode: "postcode",
                country: "country"
              }
            ]
          })
          .mockReturnValue({});
        mockGetDbPoolQuery.mockReturnValueOnce({
          rows: [{ email: marketAdminEmail }]
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          1,
          context,
          "COMPANY_REGISTERED",
          {
            email: context.user.email,
            ...mailBody
          }
        );
        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          2,
          context,
          "COMPANY_REGISTERED",
          {
            email: marketAdminEmail,
            ...mailBody
          }
        );
      });

      it("send email to multiple marketAdmins", async () => {
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T1" }] })
          .mockReturnValueOnce({
            rows: [
              {
                first_line: "first_line",
                town: "town",
                postcode: "postcode",
                country: "country"
              }
            ]
          })
          .mockReturnValue({});
        mockGetDbPoolQuery.mockReturnValueOnce({
          rows: [{ email: marketAdminEmail }, { email: `${marketAdminEmail}2` }]
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenCalledTimes(3);
        expect(sendMessageWithTemplate).toHaveBeenNthCalledWith(
          3,
          context,
          "COMPANY_REGISTERED",
          {
            email: `${marketAdminEmail}2`,
            accountId: context.user.id,
            firstname: context.user.firstName,
            company: companyName,
            city: "town"
          }
        );
      });

      it("send email to user only when no marketAdmin", async () => {
        query
          .mockReturnValueOnce({ rows: [{ id: 1, tier: "T1" }] })
          .mockReturnValueOnce({
            rows: [
              {
                first_line: "first_line",
                town: "town",
                postcode: "postcode",
                country: "country"
              }
            ]
          })
          .mockReturnValue({});
        mockGetDbPoolQuery.mockReturnValueOnce({
          rows: []
        });

        await updateCompany(resolve, source, args, context, resolveInfo);

        expect(sendMessageWithTemplate).toHaveBeenCalledTimes(1);
      });
    });

    it("throw error when catch any error", async () => {
      const args = argsFactory();
      query.mockRejectedValue(errorMessage);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorMessage);
    });

    it("throw error when catch error object", async () => {
      const args = argsFactory();
      const errorOject = { message: errorMessage };
      query.mockRejectedValue(errorOject);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toBe(errorOject);
    });

    it("throw throwUniqueViolationError when error code equal UNIQUE_VIOLATION_ERROR_CODE", async () => {
      const args = argsFactory();
      query.mockRejectedValue(errorObject);

      await expect(
        updateCompany(resolve, source, args, context, resolveInfo)
      ).rejects.toThrowError("errorUniqueViolation");
    });
  });

  describe("throwUniqueViolationError", () => {
    it("default case", () => {
      expect(() => throwUniqueViolationError("")).toThrowError(
        "errorUniqueViolation"
      );
    });

    it("constraint = company_market_id_name_key", () => {
      expect(() =>
        throwUniqueViolationError("company_market_id_name_key")
      ).toThrowError("errorCompanyNameUniqueViolation");
    });

    it("constraint = company_reference_number_key", () => {
      expect(() =>
        throwUniqueViolationError("company_reference_number_key")
      ).toThrowError("errorCompanyReferenceUniqueViolation");
    });
  });

  describe("getCompanyTier", () => {
    it("default case", async () => {
      query.mockReturnValue({
        rows: [
          {
            tier: "T1"
          }
        ]
      });
      const result = await getCompanyTier(1, context.pgClient);
      expect(result).toBe("T1");
    });

    it("query return empty array", async () => {
      query.mockReturnValue({
        rows: []
      });
      const result = await getCompanyTier(1, context.pgClient);

      expect(result).toBe(undefined);
    });

    it("query return object with no tier", async () => {
      query.mockReturnValue({
        rows: [{}]
      });
      const result = await getCompanyTier(1, context.pgClient);

      expect(result).toBe(undefined);
    });
  });
});
