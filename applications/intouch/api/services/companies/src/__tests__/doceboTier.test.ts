import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Docebo Tier", () => {
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
    describe("super admin", () => {
      it("should be able to select all records", async () => {
        const { account } = await initDb(pool, client, "SUPER_ADMIN");
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM docebo_tier");

        expect(rows.length).toBeGreaterThan(1);
      });

      it("should be able to create a record", async () => {
        const { account, dbInsertOne, market } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );

        await actAs(client, account);

        const tier = await dbInsertOne("docebo_tier", {
          market_id: market.id,
          tier_code: "T2",
          docebo_catalogue_id: 2
        });

        expect(tier).toBeTruthy();
      });

      it("should be able to update a record", async () => {
        const { account, doceboTier } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );

        await actAs(client, account);

        const { rows } = await client.query(
          "UPDATE docebo_tier SET docebo_catalogue_id = 2 WHERE id = $1 RETURNING *",
          [doceboTier.id]
        );

        expect(rows.length).toBe(1);
        expect(rows[0].docebo_catalogue_id).toBe(2);
      });

      it("should be able to delete a record", async () => {
        const { account, dbDeleteRow, doceboTier } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );

        await actAs(client, account);

        const deleted = await dbDeleteRow("docebo_tier", {
          id: doceboTier.id
        });

        expect(deleted).toBeTruthy();
      });
    });

    describe("market admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketDoceboTier } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM docebo_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM docebo_tier WHERE id = $1",
          [otherMarketDoceboTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to create a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to update a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to delete a record", async () => {
        const { account, dbDeleteRow } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbDeleteRow("docebo_tier", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });
    });

    describe("Company admin", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketDoceboTier } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM docebo_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM docebo_tier WHERE id = $1",
          [otherMarketDoceboTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to create a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to update a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to delete a record", async () => {
        const { account, dbDeleteRow } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbDeleteRow("docebo_tier", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });
    });

    describe("installer", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketDoceboTier } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM docebo_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM docebo_tier WHERE id = $1",
          [otherMarketDoceboTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to create a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to update a record", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to delete a record", async () => {
        const { account, dbDeleteRow } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        await actAs(client, account);

        try {
          await dbDeleteRow("docebo_tier", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });
    });

    describe("Auditor", () => {
      it("should be able to select all records from own market", async () => {
        const { account, otherMarketDoceboTier } = await initDb(
          pool,
          client,
          "AUDITOR"
        );
        await actAs(client, account);

        const { rows } = await client.query("SELECT * FROM docebo_tier");
        const { rows: otherMarket } = await client.query(
          "SELECT * FROM docebo_tier WHERE id = $1",
          [otherMarketDoceboTier.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarket.length).toBe(0);
      });

      it("should not be able to create a record", async () => {
        const { account, dbInsertOne } = await initDb(pool, client, "AUDITOR");
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to update a record", async () => {
        const { account, dbInsertOne } = await initDb(pool, client, "AUDITOR");
        await actAs(client, account);

        try {
          await dbInsertOne("docebo_tier", { id: 1, tier_code: "T2" });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });

      it("should not be able to delete a record", async () => {
        const { account, dbDeleteRow } = await initDb(pool, client, "AUDITOR");
        await actAs(client, account);

        try {
          await dbDeleteRow("docebo_tier", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("docebo_tier"));
        }
      });
    });
  });
});
