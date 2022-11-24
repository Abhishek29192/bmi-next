import { updateRewardTiers } from "../";

describe("Reward Record", () => {
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
  const args = (input = {}): { input } => ({
    input: {
      ...input
    }
  });

  const rewardTierFactory = (data = {}) => ({
    id: 1,
    market_id: 1,
    reward_category: "rc1",
    reward_point: 10,
    tier_code: "T1",
    created_at: "2022-01-27 12:51:39.999501",
    updated_at: "2022-01-27 12:51:39.999501",
    ...data
  });
  const mapFields = (records) =>
    records.map(
      ({
        id,
        market_id,
        reward_category,
        reward_point,
        tier_code,
        created_at,
        updated_at
      }) => ({
        id,
        marketId: market_id,
        rewardCategory: reward_category,
        rewardPoint: reward_point,
        tierCode: tier_code,
        createdAt: created_at,
        updatedAt: updated_at
      })
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateRewardTiers", () => {
    const rewardRecords = [rewardTierFactory()];
    const input = {
      rewardTiers: mapFields(rewardRecords)
    };

    it("normal case", async () => {
      const dbRewardRecords = {
        rows: rewardRecords
      };
      const resolvedData = input.rewardTiers;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => dbRewardRecords);

      const result = await updateRewardTiers(null, args(input), context);

      expect(result).toMatchObject(resolvedData);
      expect(mockQuery).toHaveBeenCalledWith(
        `UPDATE reward_tier as r set id = c.id, reward_point = c.reward_point from (values ${input.rewardTiers
          .map(({ id, rewardPoint }) => `(${id}, ${rewardPoint})`)
          .join(",")}) AS c(id, reward_point) WHERE c.id = r.id RETURNING r.*`
      );
    });

    it("Failed first query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error updating reward_tier table for reward_category(${input.rewardTiers[0].rewardCategory}), ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(updateRewardTiers(null, args(input), context)).rejects.toBe(
        message
      );

      expect(loggerError).toHaveBeenCalledWith({ message });
    });
  });
});
