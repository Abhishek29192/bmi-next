import { UpdateDoceboTiersByMarketInput } from "@bmi/intouch-api-types";
import { updateDoceboTiersByMarket } from "../";

describe("DoceboTier", () => {
  const mockQuery = jest.fn();
  const loggerError = jest.fn();
  const loggerInfo = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      error: loggerError,
      info: loggerInfo
    }),
    pgRootPool: null,
    pgClient: {
      query: mockQuery
    }
  };
  const resolve = jest.fn();
  const source = {};
  const args = (input = {}): { input: UpdateDoceboTiersByMarketInput } => ({
    input: {
      marketId: 1,
      ...input
    }
  });
  const resolveInfo = {};

  describe("updateDoceboTiersByMarket", () => {
    it("normal case", async () => {
      const input = { marketId: 1, T1: 2 };
      const doceboTiers = [
        { id: 1, marketId: 1, tier_code: "T1", docebo_catalogue_id: 1 }
      ];
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: doceboTiers
        }));
      const result = await updateDoceboTiersByMarket(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SAVEPOINT graphql_update_docebo_tiers"
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        `INSERT INTO docebo_tier (market_id, tier_code, docebo_catalogue_id) VALUES (1, 'T1', $1)
      ON CONFLICT (market_id, tier_code) DO UPDATE SET docebo_catalogue_id = EXCLUDED.docebo_catalogue_id RETURNING *`,
        [2]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        "RELEASE SAVEPOINT graphql_update_docebo_tiers"
      );
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `Sucessfully create or update docebo tier with id ${doceboTiers.map(
          ({ id }) => id
        )}`
      });
      expect(result).toBe(doceboTiers);
    });

    it("update catalogueId more than 1 tiers", async () => {
      const input = { marketId: 1, T1: 2, T2: 3 };
      const doceboTiers = [
        { id: 1, marketId: 1, tier_code: "T2", docebo_catalogue_id: 2 },
        { id: 2, marketId: 1, tier_code: "T3", docebo_catalogue_id: 3 }
      ];
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: doceboTiers
        }));
      await updateDoceboTiersByMarket(
        resolve,
        source,
        args(input),
        context,
        resolveInfo
      );

      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO docebo_tier (market_id, tier_code, docebo_catalogue_id) VALUES (1, 'T1', $1),(1, 'T2', $2)
      ON CONFLICT (market_id, tier_code) DO UPDATE SET docebo_catalogue_id = EXCLUDED.docebo_catalogue_id RETURNING *`,
        [2, 3]
      );
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `Sucessfully create or update docebo tier with id ${doceboTiers.map(
          ({ id }) => id
        )}`
      });
    });

    it("throw error when insert into db", async () => {
      const input = { marketId: 1, T1: 2 };
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockQuery.mockImplementationOnce(() => {}).mockRejectedValueOnce(error);

      await expect(
        updateDoceboTiersByMarket(
          resolve,
          source,
          args(input),
          context,
          resolveInfo
        )
      ).rejects.toBe(
        `Error updating docebo_tier table for market with ${input.marketId}, ${error}`
      );
      expect(loggerError).toHaveBeenCalledWith({
        message: `Error updating docebo_tier table for market with 1, ${error}`
      });
      expect(mockQuery).toHaveBeenCalledWith(
        "ROLLBACK TO SAVEPOINT graphql_update_docebo_tiers"
      );
    });
  });
});
