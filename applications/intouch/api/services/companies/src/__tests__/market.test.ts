import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Market", () => {
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
    it("should be able to create a market", async () => {
      const { superAdmin, dbInsertOne } = await initDb(pool, client);

      await actAs(client, superAdmin);

      const market = await dbInsertOne("market", {
        domain: "rrr",
        language: "pt"
      });

      expect(market).not.toBeNull();
      expect(market).toEqual(
        expect.objectContaining({
          domain: "rrr",
          language: "pt"
        })
      );
    });
  });

  describe("Market Admin", () => {
    it("shouldn't be able to create a market", async () => {
      try {
        const { marketAdmin, dbInsertOne } = await initDb(pool, client);

        await actAs(client, marketAdmin);

        const market = await dbInsertOne("market", {
          domain: "rrr",
          language: "pt"
        });

        expect(market).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to create a market", async () => {
      try {
        const { companyAdmin, dbInsertOne } = await initDb(pool, client);
        await actAs(client, companyAdmin);
        const market = await dbInsertOne("market", {
          domain: "rrr",
          language: "pt"
        });

        expect(market).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to create a market", async () => {
      try {
        const { account, dbInsertOne } = await initDb(pool, client);
        await actAs(client, account);
        const market = await dbInsertOne("market", {
          domain: "rrr",
          language: "pt"
        });

        expect(market).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      }
    });
  });

  describe("Auditor", () => {
    it("shouldn't be able to create a market", async () => {
      try {
        const { account, dbInsertOne } = await initDb(pool, client);
        await actAs(client, account);
        const market = await dbInsertOne("market", {
          domain: "rrr",
          language: "pt"
        });

        expect(market).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("market"));
      }
    });
  });
});
