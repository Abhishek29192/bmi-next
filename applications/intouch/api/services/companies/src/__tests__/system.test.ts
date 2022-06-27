import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Systems", () => {
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

  describe("Super Admin", () => {
    it("should be able to insert and read systems", async () => {
      const { superAdmin, market, dbInsertOne } = await initDb(pool, client);

      await actAs(client, superAdmin);

      const system = await dbInsertOne("system", {
        name: "Name",
        market_id: market.id,
        technology: "PITCHED",
        bmi_ref: "test_bmi_ref",
        maximum_validity_years: 1,
        published: true
      });

      expect(system).not.toBeNull();
    });
  });

  describe("Market Admin", () => {
    it("should be able to insert and read systems in his market", async () => {
      const { marketAdmin, market, dbInsertOne } = await initDb(pool, client);

      await actAs(client, marketAdmin);

      const system = await dbInsertOne("system", {
        name: "Name",
        market_id: market.id,
        technology: "PITCHED",
        bmi_ref: "test_bmi_ref",
        maximum_validity_years: 1,
        published: true
      });

      expect(system).not.toBeNull();
    });

    it("shouldn't be able to insert and read systems in another market", async () => {
      try {
        const { marketAdmin, dbInsertOne, otherMarket } = await initDb(
          pool,
          client
        );

        await actAs(client, marketAdmin);

        await dbInsertOne("system", {
          name: "Name",
          market_id: otherMarket.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("system"));
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to insert and read systems", async () => {
      try {
        const { companyAdmin, market, dbInsertOne } = await initDb(
          pool,
          client
        );

        await actAs(client, companyAdmin);

        await dbInsertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to insert and read systems", async () => {
      try {
        const { account, market, dbInsertOne } = await initDb(pool, client);

        await actAs(client, account);

        await dbInsertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      }
    });
  });

  describe("Auditor", () => {
    it("should able to see any system within the market", async () => {
      const { auditor, market } = await initDb(pool, client);

      await actAs(client, auditor);
      const { rows } = await client.query("SELECT * FROM system");
      const { rows: marketSystems } = await client.query(
        "SELECT * FROM system WHERE market_id = $1",
        [market.id]
      );

      expect(rows.length).toBeGreaterThan(0);
      expect(marketSystems.length).toBe(rows.length);
    });

    it("shouldn't able to see any system from other market based on RLS", async () => {
      const { auditor, otherMarket } = await initDb(pool, client);

      await actAs(client, auditor);
      const { rows } = await client.query("SELECT * FROM system");
      const { rows: otherMarketSystems } = await client.query(
        "SELECT * FROM system WHERE market_id = $1",
        [otherMarket.id]
      );

      expect(rows.length).toBeGreaterThan(0);
      expect(otherMarketSystems.length).toBe(0);
    });

    it("shouldn't be able to insert systems", async () => {
      try {
        const { auditor, market, dbInsertOne } = await initDb(pool, client);

        await actAs(client, auditor);

        await dbInsertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      }
    });

    it("shouldn't be able to update systems", async () => {
      try {
        const { auditor, system } = await initDb(pool, client);

        await actAs(client, auditor);

        const updatedSystem = await client.query(
          "UPDATE system set published = $2 WHERE id = $1 RETURNING *",
          [system.id, !system.published]
        );

        expect(updatedSystem).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      }
    });

    it("shouldn't be able to delete systems", async () => {
      try {
        const { auditor, system, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);
        const deletedSystem = await dbDeleteRow("system", {
          id: system.id
        });

        expect(deletedSystem).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      }
    });
  });
});
