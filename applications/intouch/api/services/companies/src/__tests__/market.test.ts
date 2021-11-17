import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
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
    domain: "ooo",
    language: "da"
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

  return { insertOne, account, admin, market, context };
};

describe("Market", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Super Admin", () => {
    it("shouldn't be able to create a market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, insertOne } = await initDb(pool, client);

        await actAs(client, admin);

        const market = await insertOne("market", {
          domain: "rrr",
          language: "pt"
        });

        expect(market).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
  describe("Market Admin", () => {
    it("shouldn't be able to create a market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, insertOne } = await initDb(
          pool,
          client,
          "INSTALLER",
          "MARKET_ADMIN"
        );

        await actAs(client, admin);

        await insertOne("market", {
          domain: "rrr",
          language: "pt"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
  describe("Company Admin", () => {
    it("shouldn't be able to create a market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, insertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, account);

        await insertOne("market", {
          domain: "rrr",
          language: "pt"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
  describe("Installer", () => {
    it("shouldn't be able to create a market", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, insertOne } = await initDb(pool, client);

        await actAs(client, account);

        await insertOne("market", {
          domain: "rrr",
          language: "pt"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
