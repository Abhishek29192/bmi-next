import { getCompanyRewardRecord, addRewardRecord } from "../";

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

  const rewardRecordFactory = (data = {}) => ({
    id: 1,
    market_id: 1,
    account_id: 2,
    company_id: 3,
    reward_tier: 1,
    reward_point: 10,
    created_at: "2022-01-27 12:51:39.999501",
    updated_at: "2022-01-27 12:51:39.999501",
    ...data
  });
  const mapFields = (records) =>
    records.map(
      ({
        id,
        market_id: marketId,
        account_id: accountId,
        company_id: companyId,
        reward_tier: rewardTier,
        reward_point: rewardPoint,
        created_at: createdAt,
        updated_at: updatedAt
      }) => ({
        id,
        marketId,
        accountId,
        companyId,
        rewardTier,
        rewardPoint,
        createdAt,
        updatedAt
      })
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCompanyRewardRecord", () => {
    const input = {
      companyId: 1,
      rewardEffectiveDate: "11-16-2022"
    };

    it("normal case", async () => {
      const rewardRecords = {
        rows: [rewardRecordFactory(), rewardRecordFactory({ id: 2 })]
      };
      const resolvedData = {
        total: rewardRecords.rows.length,
        points: 10,
        records: mapFields(rewardRecords.rows)
      };
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => rewardRecords)
        .mockImplementationOnce(() => ({
          rows: [{ total: resolvedData.total, points: resolvedData.points }]
        }));
      const result = await getCompanyRewardRecord(null, args(input), context);

      expect(result).toMatchObject(resolvedData);
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM reward_record WHERE company_id = $1 AND created_at > $2`,
        [input.companyId, input.rewardEffectiveDate]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT count(id) as total, SUM(reward_point) as points FROM reward_record WHERE company_id = $1 AND created_at > $2`,
        [input.companyId, input.rewardEffectiveDate]
      );
    });

    it("Failed first query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error fetching reward_record table for company with id ${input.companyId}, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(
        getCompanyRewardRecord(null, args(input), context)
      ).rejects.toBe(message);
      expect(loggerError).toHaveBeenCalledWith({ message });
    });

    it("Failed second query", async () => {
      const rewardRecords = { rows: [rewardRecordFactory()] };
      const errorMessage = "error message 2";
      const error = new Error(errorMessage);
      const message = `Error fetching reward_record table for company with id ${input.companyId}, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => rewardRecords)
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(
        getCompanyRewardRecord(null, args(input), context)
      ).rejects.toBe(message);
      expect(loggerError).toHaveBeenCalledWith({ message });
    });
  });

  describe("addRewardRecord", () => {
    const input = {
      accountId: 1,
      rewardCategory: "rc1"
    };
    const company = {
      id: 1,
      tier: "T1",
      market_id: 1
    };
    const rewardTier = {
      id: 2,
      reward_point: 5
    };
    const rewardRecords = [rewardRecordFactory()];

    it("normal case", async () => {
      const resolvedData = mapFields(rewardRecords)[0];
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [company]
        }))
        .mockImplementationOnce(() => ({
          rows: [rewardTier]
        }))
        .mockImplementationOnce(() => ({
          rows: rewardRecords
        }));

      const result = await addRewardRecord(null, { input }, context);

      expect(result).toMatchObject(resolvedData);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT c.tier, c.market_id, c.id FROM company_member m LEFT JOIN account a ON a.id = m.account_id JOIN company c ON m.company_id = c.id WHERE a.id = $1",
        [input.accountId]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT id, reward_point FROM reward_tier WHERE reward_category = $1 AND tier_code = $2 AND market_id = $3",
        [input.rewardCategory, company.tier, company.market_id]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO reward_record (market_id, account_id, company_id, reward_tier, reward_point) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [
          company.market_id,
          input.accountId,
          company.id,
          rewardTier.id,
          rewardTier.reward_point
        ]
      );
    });

    it("Failed first query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error creating record in reward_request table for account with id ${input.accountId}, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(addRewardRecord(null, args(input), context)).rejects.toBe(
        message
      );
      expect(loggerError).toHaveBeenCalledWith({ message });
    });

    it("first query return empty array", async () => {
      const message = `No company found for account with id ${input.accountId}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({ rows: [] }));

      const result = await addRewardRecord(null, args(input), context);

      expect(result).toBe(null);
      expect(loggerError).toHaveBeenCalledWith({ message });
    });

    it("Failed second query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error creating record in reward_request table for account with id ${input.accountId}, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [company]
        }))
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(addRewardRecord(null, args(input), context)).rejects.toBe(
        message
      );
      expect(loggerError).toHaveBeenCalledWith({ message });
    });

    it("Second query return empty array", async () => {
      const message = `No reward_tier found for rewardCategory ${input.rewardCategory} with tier ${company.tier}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [company]
        }))
        .mockImplementationOnce(() => ({ rows: [] }));

      const result = await addRewardRecord(null, args(input), context);

      expect(result).toBe(null);
      expect(loggerError).toHaveBeenCalledWith({ message });
    });

    it("Failed third query", async () => {
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      const message = `Error creating record in reward_request table for account with id ${input.accountId}, ${error}`;
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [company]
        }))
        .mockImplementationOnce(() => ({
          rows: [rewardTier]
        }))
        .mockImplementationOnce(() => Promise.reject(error));

      await expect(addRewardRecord(null, args(input), context)).rejects.toBe(
        message
      );
      expect(loggerError).toHaveBeenCalledWith({ message });
    });
  });
});
