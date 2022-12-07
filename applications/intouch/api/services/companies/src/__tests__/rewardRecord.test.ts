import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Reward Record", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  describe("DB permissions", () => {
    describe("Super Admin", () => {
      it("should be able to select all records from all market", async () => {
        const { account, otherMarketRewardRecord } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_record");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_record WHERE id = $1",
          [otherMarketRewardRecord.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBeGreaterThan(0);
      });

      it("should be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "SUPER_ADMIN");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_tier: rewardTier.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        const record = await dbInsertOne("reward_record", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Market Admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardRecord } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_record");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_record WHERE id = $1",
          [otherMarketRewardRecord.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "MARKET_ADMIN");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_tier: rewardTier.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_record", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_record"));
        }
      });
    });

    describe("Company Admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardRecord } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_record");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_record WHERE id = $1",
          [otherMarketRewardRecord.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "COMPANY_ADMIN");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_tier: rewardTier.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        const record = await dbInsertOne("reward_record", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Installer", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardRecord } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_record");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_record WHERE id = $1",
          [otherMarketRewardRecord.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "INSTALLER");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_tier: rewardTier.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        const record = await dbInsertOne("reward_record", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Auditor", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardRecord } = await initDb(
          pool,
          client,
          "AUDITOR"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_record");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_record WHERE id = $1",
          [otherMarketRewardRecord.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "AUDITOR");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_tier: rewardTier.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_record", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_record"));
        }
      });
    });
  });
});
