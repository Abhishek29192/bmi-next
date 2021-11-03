import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED,
  RLS_ERROR
} from "../test-utils/db";

let pool;

const initDb = async (
  pool,
  client,
  accountRole = "INSTALLER",
  adminRole = "SUPER_ADMIN"
) => {
  const context = {
    pool,
    client,
    cleanupBucket: {}
  };
  const insertOne = curryContext(context, dbInsertOne);
  const market = await insertOne("market", {
    domain: "da",
    language: "da"
  });

  const otherMarket = await insertOne("market", {
    domain: "pt",
    language: "pt"
  });

  const account = await insertOne("account", {
    role: accountRole,
    email: "somemail@email.com",
    market_id: market.id
  });

  const admin = await insertOne("account", {
    role: adminRole,
    email: "someothermail@email.com",
    market_id: market.id
  });

  return { insertOne, account, admin, market, otherMarket, context };
};

describe("Products", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Super Admin", () => {
    it("should be able to insert and read products", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, market, insertOne } = await initDb(pool, client);

        await actAs(client, admin);

        const product = await insertOne("product", {
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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Market Admin", () => {
    it("should be able to insert and read products in his market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, market, insertOne } = await initDb(
          pool,
          client,
          "INSTALLER",
          "MARKET_ADMIN"
        );

        await actAs(client, admin);

        const product = await insertOne("product", {
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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to insert and read products in another market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, insertOne, otherMarket } = await initDb(
          pool,
          client,
          "INSTALLER",
          "MARKET_ADMIN"
        );

        await actAs(client, admin);

        await insertOne("product", {
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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to insert and read products", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, market, insertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, account);

        await insertOne("product", {
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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to insert and read products", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, market, insertOne } = await initDb(pool, client);

        await actAs(client, account);

        await insertOne("product", {
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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
