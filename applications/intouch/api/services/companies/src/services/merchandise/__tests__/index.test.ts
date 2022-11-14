process.env.MERCHANDISE_CLIENT_SECRET = "MERCHANDISE_CLIENT_SECRET";
process.env.MERCHANDISE_ENCRYPTION_KEY = "MERCHANDISE_ENCRYPTION_KEY";
process.env.MERCHANDISE_IV_KEY = "MERCHANDISE_IV_KEY";
process.env.MERCHANDISE_API = "1test/api";
process.env.FRONTEND_URL = "AUTH0_API_DOMAIN";
process.env.MERCHANDISE_MARKET = '{"en": {"country": 1, "lang": "en"}}';

import { UpdateDoceboTiersByMarketInput } from "@bmi/intouch-api-types";
import {
  performMerchandiseSso,
  ssoAccount,
  updateMerchandiseTiersByMarket,
  parseMarket
} from "../";
import { getDbPool } from "../../../test-utils/db";

const mockPubSub = jest.fn();
const mockQuery = jest.fn();
const mockRootQuery = jest.fn();
const resolve = jest.fn();
const mockClientGateway = jest.fn();
const mockUploadFileByStream = jest.fn();
const mockDeleteFile = jest.fn();
const loggerError = jest.fn();
const loggerInfo = jest.fn();

const mockInstance = jest.fn();
jest.mock("../instance", () => ({
  setInstance: () => ({
    post: (...params) => mockInstance(...params)
  })
}));

const logger = () => ({
  error: loggerError,
  info: loggerInfo
});

describe("Merchandise SSO", () => {
  let pool;

  const userCanMock = jest.fn();
  const userTermsToAccept = jest.fn();

  const source = {};

  const context: any = {
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
  });

  describe("performMerchandiseSso", () => {
    const args = {
      email: "test@mail.me"
    };
    const account: ssoAccount = {
      account_id: 1,
      first_name: "",
      last_name: "",
      phone: "",
      company_name: "",
      tier: "T1",
      town: "",
      country: "",
      postcode: "",
      merchandising_url: "",
      domain: "",
      market_id: 1
    };

    it("user is registered", async () => {
      mockQuery
        .mockImplementationOnce(() => ({
          rows: [account]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ merchandise_division_id: 2 }]
        }));

      mockInstance.mockImplementation(() =>
        Promise.resolve({ data: { token: "token" } })
      );

      const response = await performMerchandiseSso(resolve, args, context);
      expect(response).toContain("1test/api/login?data=");
    });

    it("user is not registered", async () => {
      mockQuery
        .mockImplementationOnce(() => ({
          rows: [account]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ merchandise_division_id: 2 }]
        }));

      mockInstance
        .mockImplementationOnce(() =>
          Promise.resolve({
            data: { status: "register", token: "token" }
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            data: { token: "token2" }
          })
        );

      const response = await performMerchandiseSso(resolve, args, context);
      expect(response).toContain("1test/api/login?data=");
    });

    it("no proper division", async () => {
      mockQuery
        .mockImplementationOnce(() => ({
          rows: [account]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      try {
        await performMerchandiseSso(resolve, args, context);
      } catch (error) {
        expect(error.message).toEqual("Can't find proper division");
      }
    });

    it("missing token", async () => {
      mockQuery
        .mockImplementationOnce(() => ({
          rows: [account]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ merchandise_division_id: 2 }]
        }));

      mockInstance.mockImplementation(() =>
        Promise.resolve({ data: { token: null } })
      );

      try {
        await performMerchandiseSso(resolve, args, context);
      } catch (error) {
        expect(error.message).toEqual("Missing token from Merchandise SSO");
      }
    });
  });

  describe("updateMerchandiseTiersByMarket", () => {
    const args = (input = {}): { input: UpdateDoceboTiersByMarketInput } => ({
      input: {
        marketId: 1,
        ...input
      }
    });

    it("normal case", async () => {
      const input = { marketId: 1, T1: 2 };
      const merchandiseTiers = [
        { id: 1, marketId: 1, tier_code: "T1", merchandise_division_id: 1 }
      ];
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: merchandiseTiers
        }));
      const result = await updateMerchandiseTiersByMarket(
        resolve,
        source,
        args(input),
        context
      );

      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SAVEPOINT graphql_update_merchandise_tiers"
      );

      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        "RELEASE SAVEPOINT graphql_update_merchandise_tiers"
      );
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `Successfully create or update merchandise tier with id ${merchandiseTiers.map(
          ({ id }) => id
        )}`
      });
      expect(result).toBe(merchandiseTiers);
    });

    it("throw error when insert into db", async () => {
      const input = { marketId: 1, T1: 2 };
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockQuery.mockImplementationOnce(() => {}).mockRejectedValueOnce(error);

      await expect(
        updateMerchandiseTiersByMarket(resolve, source, args(input), context)
      ).rejects.toBe(
        `Error updating merchandise_tier table for market with ${input.marketId}, ${error}`
      );
      expect(loggerError).toHaveBeenCalledWith({
        message: `Error updating merchandise_tier table for market with 1, ${error}`
      });
      expect(mockQuery).toHaveBeenCalledWith(
        "ROLLBACK TO SAVEPOINT graphql_update_merchandise_tiers"
      );
    });
  });

  describe("parseMarket", () => {
    it("Parse market map correctly.", async () => {
      expect(parseMarket("en")).toMatchObject({
        country: 1,
        lang: "en"
      });
    });
    it("throw error when parsing map", async () => {
      process.env.MERCHANDISE_MARKET = "{";
      try {
        parseMarket("en");
      } catch (error) {
        expect(error.message).toEqual("Can't find proper market map");
      }
    });
  });
});
