process.env.FRONTEND_URL = "FRONTEND_URL";
process.env.APP_ENV = "dev";
import {
  createDoubleAcceptance,
  updateDoubleAcceptance,
  getDoubleAcceptanceByValidTempToken,
  autoRejectDoubleAcceptance,
  releaseGuaranteePdf
} from "../";

const sendMessageWithTemplateSpy = jest.fn();
jest.mock("../../mailer", () => ({
  sendMessageWithTemplate: (...params) => sendMessageWithTemplateSpy(params)
}));
const publishSpy = jest.fn();
jest.mock("../../../services/events", () => ({
  publish: (...params) => publishSpy(params),
  TOPICS: {
    GUARANTEE_PDF: "GUARANTEE_PDF"
  }
}));

describe("DoubleAcceptance", () => {
  const mockQuery = jest.fn();
  const mockRootQuery = jest.fn();
  const loggerError = jest.fn();
  const loggerInfo = jest.fn();
  const mockGetPrivateAssetSignedUrl = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      error: loggerError,
      info: loggerInfo
    }),
    pgRootPool: {
      query: mockRootQuery
    },
    pgClient: {
      query: mockQuery
    },
    protocol: "http",
    storageClient: {
      getPrivateAssetSignedUrl: mockGetPrivateAssetSignedUrl
    },
    user: {
      market: {
        domain: "en"
      }
    }
  };
  const resolve = jest.fn();
  const source = {};
  const args = (input = {}): { input } => ({
    input: {
      ...input
    }
  });
  const resolveInfo = {};
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe("createDoubleAcceptance", () => {
    const input = { id: 1 };
    it("normal case", async () => {
      const domain = "no";
      const resolvedData = {
        data: {
          $guaranteeId: 1,
          $tempToken: "tempToken"
        }
      };
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            { market_id: 1, building_owner_mail: "building_owner_mail", domain }
          ]
        }));
      resolve.mockResolvedValueOnce(resolvedData);
      const result = await createDoubleAcceptance(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(resolve).toHaveBeenCalledWith(
        source,
        {
          input: {
            ...input
          }
        },
        context,
        resolveInfo
      );
      expect(sendMessageWithTemplateSpy).toHaveBeenCalledWith([
        { ...context, user: { market: { domain } } },
        "DOUBLE_ACCEPTANCE",
        {
          email: "building_owner_mail",
          doubleAcceptanceLink: `${context.protocol}://dev-${domain}.${process.env.FRONTEND_URL}/double-acceptance/tempToken`
        }
      ]);
      expect(result).toBe(resolvedData);
    });

    it("replace empty string when no temptoken returned", async () => {
      const domain = "en";
      const resolvedData = {
        data: {
          $guaranteeId: 1
        }
      };
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            { market_id: 1, building_owner_mail: "building_owner_mail", domain }
          ]
        }));
      resolve.mockResolvedValueOnce(resolvedData);
      await createDoubleAcceptance(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(sendMessageWithTemplateSpy).toHaveBeenCalledWith([
        { ...context, user: { market: { domain } } },
        "DOUBLE_ACCEPTANCE",
        {
          email: "building_owner_mail",
          doubleAcceptanceLink: ""
        }
      ]);
    });

    it("it do not change user doamin to guarantee market domain when user has no market in context", async () => {
      const domain = "no";
      const resolvedData = {
        data: {
          $guaranteeId: 1,
          $tempToken: "tempToken"
        }
      };
      const noUserMarketContext = { ...context, user: {} };
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            { market_id: 1, building_owner_mail: "building_owner_mail", domain }
          ]
        }));
      resolve.mockResolvedValueOnce(resolvedData);
      const result = await createDoubleAcceptance(
        resolve,
        source,
        args(input),
        noUserMarketContext,
        resolveInfo
      );

      expect(resolve).toHaveBeenCalledWith(
        source,
        {
          input: {
            ...input
          }
        },
        noUserMarketContext,
        resolveInfo
      );
      expect(sendMessageWithTemplateSpy).toHaveBeenCalledWith([
        noUserMarketContext,
        "DOUBLE_ACCEPTANCE",
        {
          email: "building_owner_mail",
          doubleAcceptanceLink: `${context.protocol}://dev-${domain}.${process.env.FRONTEND_URL}/double-acceptance/tempToken`
        }
      ]);
      expect(result).toBe(resolvedData);
    });

    it("throw error when insert into db", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      resolve.mockRejectedValueOnce(error);

      await expect(
        createDoubleAcceptance(
          resolve,
          source,
          args(input),
          context,
          resolveInfo
        )
      ).rejects.toBe(error);
      expect(loggerError).toHaveBeenCalledWith({
        message: `Error insert data into double_acceptance, ${error}`
      });
      expect(mockQuery).toHaveBeenCalledWith(
        "ROLLBACK TO SAVEPOINT graphql_create_double_acceptance"
      );
      expect(mockQuery).toHaveBeenCalledWith(
        "RELEASE SAVEPOINT graphql_create_double_acceptance"
      );
    });
  });

  describe("updateDoubleAcceptance", () => {
    const input = {
      id: 1,
      patch: {
        signature: "signature",
        acceptance: true,
        acceptanceDate: "acceptanceDate"
      }
    };

    it("normal case", async () => {
      const doubleAcceptance = {
        id: 1,
        ...input.patch,
        guarantee_id: 1
      };
      mockRootQuery.mockImplementationOnce(() => ({
        rows: [doubleAcceptance]
      }));
      const result = await updateDoubleAcceptance(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(result).toEqual(
        expect.objectContaining({
          updateDoubleAcceptance: { doubleAcceptance }
        })
      );
    });

    it("Should update guarantee status when acceptance is false", async () => {
      const doubleAcceptance = {
        guarantee_id: 1
      };
      mockRootQuery.mockImplementationOnce(() => ({
        rows: [doubleAcceptance]
      }));
      await updateDoubleAcceptance(
        resolve,
        source,
        args({ id: input.id, patch: { ...input.patch, acceptance: false } }),
        context,
        resolveInfo
      );

      expect(mockRootQuery).toHaveBeenLastCalledWith(
        `UPDATE guarantee SET status=$1 WHERE id = $2 RETURNING id`,
        ["DECLINED", doubleAcceptance.guarantee_id]
      );
    });

    it("throw error when insert into db", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockRootQuery.mockRejectedValueOnce(error);

      await expect(
        updateDoubleAcceptance(
          resolve,
          source,
          args(input),
          context,
          resolveInfo
        )
      ).rejects.toBe(error);

      expect(loggerError).toHaveBeenCalledWith({
        message: `Error update data for double acceptance or related guarantee, ${error}`
      });
    });
  });

  describe("getDoubleAcceptanceByValidTempToken", () => {
    const input = {
      tempToken: "temp_token"
    };

    it("normal case", async () => {
      const guarantee = {
        guarantee_id: 1,
        temp_token: input.tempToken,
        expiry_date: new Date(),
        acceptance_date: new Date(),
        language_code: "en",
        maximum_validity_years: 10,
        coverage: "",
        id: 2,
        signature: "signature",
        acceptance: true,
        technology: "PITCH"
      };
      mockRootQuery
        .mockReturnValueOnce({ rows: [guarantee] })
        .mockReturnValueOnce({
          rows: [
            {
              maximum_validity_years: guarantee.maximum_validity_years
            }
          ]
        });
      const result = await getDoubleAcceptanceByValidTempToken(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(result).toEqual({
        guaranteeId: guarantee.guarantee_id,
        tempToken: guarantee.temp_token,
        expiryDate: guarantee.expiry_date,
        acceptanceDate: guarantee.acceptance_date,
        maximumValidityYears: guarantee.maximum_validity_years,
        languageCode: guarantee.language_code,
        id: guarantee.id,
        signature: guarantee.signature,
        acceptance: guarantee.acceptance,
        technology: guarantee.technology,
        coverage: guarantee.coverage
      });
      expect(mockRootQuery).toHaveBeenNthCalledWith(
        1,
        `SELECT d.*, g.language_code, g.coverage, p.technology FROM double_acceptance d JOIN guarantee g ON g.id = d.guarantee_id JOIN project p ON g.project_id = p.id WHERE d.temp_token = $1`,
        [guarantee.temp_token]
      );
      expect(mockRootQuery).toHaveBeenNthCalledWith(
        2,
        `SELECT pt.maximum_validity_years FROM guarantee g JOIN product pt ON pt.bmi_ref = g.product_bmi_ref WHERE g.id = $1 UNION SELECT s.maximum_validity_years FROM guarantee g JOIN system s ON g.system_bmi_ref = s.bmi_ref WHERE g.id = $1`,
        [guarantee.guarantee_id]
      );
    });

    it("throw error when insert into db", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockRootQuery.mockImplementationOnce(() => Promise.reject(error));

      await expect(
        getDoubleAcceptanceByValidTempToken(
          resolve,
          source,
          args(input),
          context,
          resolveInfo
        )
      ).rejects.toBe(error);

      expect(loggerError).toHaveBeenCalledWith({
        message: `Error fetching double acceptance data, ${error}`
      });
    });
  });

  describe("autoRejectDoubleAcceptance", () => {
    const doubleAcceptance = {
      guarantee_id: 1,
      temp_token: "temp_token",
      expiry_date: new Date(),
      acceptance_date: new Date(),
      maximum_validity_years: 10,
      language_code: "en",
      coverage: "",
      id: 1,
      signature: "signature",
      acceptance: true,
      technology: "PITCH"
    };

    it("normal case", async () => {
      mockQuery
        .mockReturnValue({})
        .mockReturnValue({
          rows: [{ guarantee_id: doubleAcceptance.guarantee_id }]
        })
        .mockReturnValue({ rows: [{ id: doubleAcceptance.id }] });
      const result = await autoRejectDoubleAcceptance(
        resolve,
        source,
        args(),
        context,
        resolveInfo
      );
      const message = `Double Acceptance(s) with id(s) ${doubleAcceptance.id} has been auto rejected and related guarantee(s) status have been set to EXPIRED`;

      expect(result).toEqual(message);
      expect(loggerInfo).toHaveBeenCalledWith({ message });
    });

    it("No Matched Double Acceptance Being Returned", async () => {
      mockQuery.mockReturnValue({}).mockReturnValue({
        rows: []
      });
      const result = await autoRejectDoubleAcceptance(
        resolve,
        source,
        args(),
        context,
        resolveInfo
      );
      const message = `No double Acceptance to be auto reject`;

      expect(result).toEqual(message);
      expect(loggerInfo).toHaveBeenCalledWith({ message });
    });

    it("throw error when insert into db", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockQuery
        .mockImplementationOnce(() => ({}))
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(
        autoRejectDoubleAcceptance(
          resolve,
          source,
          args(),
          context,
          resolveInfo
        )
      ).rejects.toBe(error);

      expect(loggerError).toHaveBeenCalledWith({
        message: `Error updating data for double acceptance, ${error}`
      });
    });
  });

  describe("releaseGuaranteePdf", () => {
    const input = {
      id: 1,
      template: {
        mailBody: "mailBody",
        mailSubject: "mailSubject"
      }
    };

    it("normal case", async () => {
      const guarantee = {
        status: "APPROVED",
        building_owner_mail: "building_owner_mail",
        file_storage_id: "file_storage_id",
        product_name: "product_name",
        system_name: "system_name",
        coverage: "SOLUTION",
        domain: "en"
      };
      const data = {
        id: input.id,
        status: guarantee.status,
        project: {
          buildingOwnerMail: guarantee.building_owner_mail,
          company: {
            market: {
              domain: guarantee.domain
            }
          }
        },
        guaranteeType: {
          coverage: guarantee.coverage,
          guaranteeTemplatesCollection: {
            items: [input.template]
          }
        },
        productByProductBmiRef: {
          name: guarantee.product_name
        },
        systemBySystemBmiRef: {
          name: guarantee.system_name
        },
        fileStorageId: guarantee.file_storage_id,
        signedFileStorageUrl: "signedFileStorageUrl"
      };
      mockRootQuery
        .mockReturnValueOnce({ rows: [guarantee] })
        .mockReturnValueOnce({
          rows: [
            {
              product_name: data.productByProductBmiRef.name,
              system_name: data.systemBySystemBmiRef.name
            }
          ]
        });
      mockGetPrivateAssetSignedUrl.mockReturnValueOnce("signedFileStorageUrl");
      publishSpy.mockReturnValueOnce(1);
      const result = await releaseGuaranteePdf(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(result).toEqual(
        expect.objectContaining({
          messageId: 1
        })
      );
      expect(mockGetPrivateAssetSignedUrl).toHaveBeenCalledWith(
        guarantee.file_storage_id
      );
      expect(publishSpy).toHaveBeenCalledWith([
        expect.any(Object),
        "GUARANTEE_PDF",
        data
      ]);
    });

    it("throw error when insert into db", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockRootQuery.mockRejectedValueOnce(error);

      await expect(
        releaseGuaranteePdf(resolve, source, args(input), context, resolveInfo)
      ).rejects.toBe(error);

      expect(loggerError).toHaveBeenCalledWith({
        message: `Error getting guarantee data for release guarantee pdf, ${error}`
      });
    });
  });
});
