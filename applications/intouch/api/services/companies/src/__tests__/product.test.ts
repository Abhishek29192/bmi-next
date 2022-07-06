import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Products", () => {
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
    it("should be able to insert and read products", async () => {
      const { superAdmin, market, dbInsertOne } = await initDb(pool, client);

      await actAs(client, superAdmin);

      const product = await dbInsertOne("product", {
        name: "Name",
        market_id: market.id,
        technology: "PITCHED",
        bmi_ref: "test_bmi_ref",
        maximum_validity_years: 1,
        published: true,
        brand: "test_brand",
        family: "test_family"
      });

      expect(product).toEqual(
        expect.objectContaining({
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true,
          brand: "test_brand",
          family: "test_family"
        })
      );
    });
  });

  describe("Market Admin", () => {
    it("should be able to insert and read products in his market", async () => {
      const { marketAdmin, market, dbInsertOne } = await initDb(pool, client);

      await actAs(client, marketAdmin);

      const product = await dbInsertOne("product", {
        name: "Name",
        market_id: market.id,
        technology: "PITCHED",
        bmi_ref: "test_bmi_ref",
        maximum_validity_years: 1,
        published: true,
        brand: "test_brand",
        family: "test_family"
      });

      expect(product).not.toBeNull();
    });

    it("shouldn't be able to insert and read products in another market", async () => {
      try {
        const { marketAdmin, dbInsertOne, otherMarket } = await initDb(
          pool,
          client
        );

        await actAs(client, marketAdmin);

        await dbInsertOne("product", {
          name: "Name",
          market_id: otherMarket.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true,
          brand: "test_brand",
          family: "test_family"
        });
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("product"));
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to insert and read products", async () => {
      try {
        const { companyAdmin, market, dbInsertOne } = await initDb(
          pool,
          client
        );

        await actAs(client, companyAdmin);

        await dbInsertOne("product", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true,
          brand: "test_brand",
          family: "test_family"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("product"));
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to insert and read products", async () => {
      try {
        const { account, market, dbInsertOne } = await initDb(pool, client);

        await actAs(client, account);

        await dbInsertOne("product", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true,
          brand: "test_brand",
          family: "test_family"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("product"));
      }
    });
  });

  describe("Auditor", () => {
    it("shouldn't be able to insert product", async () => {
      try {
        const { auditor, market, dbInsertOne } = await initDb(pool, client);

        await actAs(client, auditor);

        const product = await dbInsertOne("product", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true,
          brand: "test_brand",
          family: "test_family"
        });

        expect(product).toBeNull();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("product"));
      }
    });

    it("should be able to read any products within the same market", async () => {
      const { auditor } = await initDb(pool, client);
      await actAs(client, auditor);
      const { rows } = await client.query("SELECT * FROM product");

      expect(rows.length).toBeGreaterThan(0);
    });

    it("shouldn't be able to read any products from another market", async () => {
      const { auditor, superAdmin, dbInsertOne, otherMarket } = await initDb(
        pool,
        client
      );
      await actAs(client, superAdmin);
      const product = await dbInsertOne("product", {
        name: "Name",
        market_id: otherMarket.id,
        technology: "PITCHED",
        bmi_ref: "test_bmi_ref_2",
        maximum_validity_years: 1,
        published: true,
        brand: "test_brand",
        family: "test_family"
      });
      await actAs(client, auditor);
      const { rows } = await client.query(
        `SELECT * FROM product WHERE id = $1`,
        [product.id]
      );

      expect(rows.length).toBe(0);
    });
  });
});
