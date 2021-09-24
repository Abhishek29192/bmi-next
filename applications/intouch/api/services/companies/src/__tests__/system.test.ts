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

describe("Systems", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Super Admin", () => {
    it("should be able to insert and read systems", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, market, insertOne } = await initDb(pool, client);

        await actAs(client, admin);

        const system = await insertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });

        expect(system).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Market Admin", () => {
    it("should be able to insert and read systems in his market", async () => {
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

        const system = await insertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });

        expect(system).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to insert and read systems in another market", async () => {
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

        await insertOne("system", {
          name: "Name",
          market_id: otherMarket.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("system"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to insert and read systems", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, market, insertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, account);

        await insertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to insert and read systems", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, market, insertOne } = await initDb(pool, client);

        await actAs(client, account);

        await insertOne("system", {
          name: "Name",
          market_id: market.id,
          technology: "PITCHED",
          bmi_ref: "test_bmi_ref",
          maximum_validity_years: 1,
          published: true
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("system"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
