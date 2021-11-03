import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;

const initDb = async (client) => {
  const context = {
    client,
    cleanupBucket: {}
  };
  const insertOne = curryContext(context, dbInsertOne);
  const market = await insertOne("market", {
    domain: "da",
    language: "da"
  });

  const installer = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail1@email.com",
    market_id: market.id
  });

  const admin = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail@email.com",
    market_id: market.id
  });

  return { insertOne, installer, market, admin };
};

describe("Address", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    it("shouldn't be able to add an address", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installer, insertOne } = await initDb(client);

        await actAs(client, installer);

        await insertOne("address", {
          first_line: "First Line"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("address"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Company Admin", () => {
    it("should be able to send an invitation", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, insertOne } = await initDb(client);

        await actAs(client, admin);

        const address = await insertOne("address", {
          first_line: "First Line",
          postcode: "postcode"
        });

        expect(address).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
