import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Reward Request", () => {
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
        const { superAdmin, otherMarketRewardRequest } = await initDb(
          pool,
          client
        );
        await actAs(client, superAdmin);

        const { rows } = await client.query("SELECT * FROM reward_request");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherMarketRewardRequest.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBeGreaterThan(0);
      });

      it("should be able to add record", async () => {
        const { superAdmin, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client);
        const insert = {
          market_id: market.id,
          account_id: superAdmin.id,
          company_id: company.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, superAdmin);

        const record = await dbInsertOne("reward_request", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Market Admin", () => {
      it("should be able to select all records from own market", async () => {
        const { marketAdmin, otherMarketRewardRequest } = await initDb(
          pool,
          client
        );
        await actAs(client, marketAdmin);

        const { rows } = await client.query("SELECT * FROM reward_request");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherMarketRewardRequest.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { marketAdmin, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client);
        const insert = {
          market_id: market.id,
          account_id: marketAdmin.id,
          company_id: company.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, marketAdmin);

        try {
          await dbInsertOne("reward_request", insert);
        } catch (error) {
          expect(error.message).toBe(RLS_ERROR("reward_request"));
        }
      });
    });

    describe("Company Admin", () => {
      it("should be able to select all records from own company", async () => {
        const {
          companyAdmin,
          otherCompanyRewardRequest,
          otherMarketRewardRequest
        } = await initDb(pool, client);
        await actAs(client, companyAdmin);

        const { rows } = await client.query("SELECT * FROM reward_request");
        const { rows: otherCompany } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherCompanyRewardRequest.id]
        );
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherMarketRewardRequest.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
        expect(otherCompany.length).toBe(0);
      });

      it("should be able to add record", async () => {
        const { companyAdmin, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client);
        const insert = {
          market_id: market.id,
          account_id: companyAdmin.id,
          company_id: company.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, companyAdmin);

        const record = await dbInsertOne("reward_request", insert);
        expect(record).toEqual(expect.objectContaining(insert));
      });
    });

    describe("Installer", () => {
      it("should not be able to select all records from market", async () => {
        const { account, otherMarketRewardRequest } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_request");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherMarketRewardRequest.id]
        );

        expect(rows.length).toBe(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to add record", async () => {
        const { account, market, company, rewardTier, dbInsertOne } =
          await initDb(pool, client, "INSTALLER");
        const insert = {
          market_id: market.id,
          account_id: account.id,
          company_id: company.id,
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_request", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_request"));
        }
      });
    });

    describe("Auditor", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketRewardRequest } = await initDb(
          pool,
          client,
          "AUDITOR"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM reward_request");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM reward_request WHERE id = $1",
          [otherMarketRewardRequest.id]
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
          reward_point: rewardTier.reward_point
        };
        await actAs(client, account);

        try {
          await dbInsertOne("reward_request", insert);
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("reward_request"));
        }
      });
    });
  });
});
