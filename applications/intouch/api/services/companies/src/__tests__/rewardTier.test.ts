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
        const { account, otherMarketRewardTier } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_tier WHERE id = $1",
          [otherMarketRewardTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBeGreaterThan(0);
      });

      it("should be able to add record", async () => {
        const { account, market, dbInsertOne } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        const insert = {
          market_id: market.id,
          tier_code: "T1",
          reward_category: "rc2",
          reward_point: 5
        };
        await actAs(client, account);

        const record = await dbInsertOne("reward_tier", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Market Admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardTier } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_tier WHERE id = $1",
          [otherMarketRewardTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, dbInsertOne } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        const insert = {
          market_id: market.id,
          tier_code: "T1",
          reward_category: "rc2",
          reward_point: 5
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_tier", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_tier"));
        }
      });
    });

    describe("Company Admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardTier } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_tier WHERE id = $1",
          [otherMarketRewardTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        const insert = {
          market_id: market.id,
          tier_code: "T1",
          reward_category: "rc2",
          reward_point: 5
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_tier", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_tier"));
        }
      });
    });

    describe("Installer", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardTier } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_tier WHERE id = $1",
          [otherMarketRewardTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        const insert = {
          market_id: market.id,
          tier_code: "T1",
          reward_category: "rc2",
          reward_point: 5
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_tier", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_tier"));
        }
      });
    });

    describe("Auditor", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardTier } = await initDb(
          pool,
          client,
          "AUDITOR"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_tier WHERE id = $1",
          [otherMarketRewardTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, dbInsertOne } = await initDb(
          pool,
          client,
          "AUDITOR"
        );
        const insert = {
          market_id: market.id,
          tier_code: "T1",
          reward_category: "rc2",
          reward_point: 5
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_tier", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_tier"));
        }
      });
    });
  });
});
