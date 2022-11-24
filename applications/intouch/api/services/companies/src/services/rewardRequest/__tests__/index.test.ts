import { createRewardRequest } from "../";
import * as mailer from "../../../services/mailer";

jest.mock("../../../services/mailer");

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
    marketId: 1,
    ...input
  }
});
const resolveInfo = {};

describe("Reward Record", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRewardRequest", () => {
    const input = {
      companyId: 1,
      rewardEffectiveDate: "11-16-2022"
    };
    const resovledData = {
      data: {
        $companyId: input.companyId,
        $redemptionCode: "redmeption_code"
      }
    };

    it("normal case", async () => {
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ email: "company_admin1@test.com" }]
        }));
      resolve.mockImplementationOnce(() => resovledData);

      const result = await createRewardRequest(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(resolve).toHaveBeenCalledWith(
        source,
        args(input),
        context,
        resolveInfo
      );
      expect(result).toMatchObject(resovledData);
      expect(loggerInfo).toHaveBeenCalledWith(
        `Reward request has been created for company with id: ${result.data.$companyId}`
      );
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT a.*, c.name as company_name from account a JOIN company_member m on m.account_id = a.id JOIN company c ON m.company_id = c.id WHERE m.company_id=$1 and a.role=$2`,
        [result.data.$companyId, "COMPANY_ADMIN"]
      );
      expect(mailer.sendMessageWithTemplate).toHaveBeenCalledTimes(1);
      expect(mailer.sendMailToMarketAdmins).toHaveBeenCalledWith(
        context,
        "REWARD_REQUESTED",
        {
          redemptionCode: result.data.$redemptionCode
        }
      );
    });

    it("send email to multiple company admins", async () => {
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            { email: "company_admin1@test.com" },
            { email: "company_admin2@test.com" }
          ]
        }));
      resolve.mockImplementationOnce(() => resovledData);

      const result = await createRewardRequest(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(mailer.sendMessageWithTemplate).toHaveBeenCalledTimes(2);
      expect(mailer.sendMessageWithTemplate).toHaveBeenCalledWith(
        context,
        "REWARD_REQUESTED",
        {
          email: "company_admin1@test.com",
          redemptionCode: result.data.$redemptionCode
        }
      );
      expect(mailer.sendMessageWithTemplate).toHaveBeenCalledWith(
        context,
        "REWARD_REQUESTED",
        {
          email: "company_admin2@test.com",
          redemptionCode: result.data.$redemptionCode
        }
      );
    });

    it("Failed first query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error creating a reward request, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => Promise.reject(error));
      resolve.mockImplementationOnce(() => resovledData);

      await expect(
        createRewardRequest(resolve, source, args(input), context, resolveInfo)
      ).rejects.toBe(message);

      expect(loggerError).toHaveBeenCalledWith({ message });
    });
  });
});
