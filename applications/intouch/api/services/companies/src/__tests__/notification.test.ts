import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED,
  cleanup
} from "../test-utils/db";

let pool;

const initDb = async (pool, client) => {
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

  const account = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail@email.com",
    market_id: market.id
  });

  const admin = await insertOne("account", {
    role: "SUPER_ADMIN",
    email: "someothermail@email.com",
    market_id: market.id
  });

  const notification = await insertOne("notification", {
    account_id: account.id,
    send_date: new Date(),
    read: false,
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
  });

  return { insertOne, account, admin, market, notification, context };
};

describe("Notification", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    it("shouldn't be able to create a notification", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, insertOne } = await initDb(pool, client);

        await actAs(client, account);

        await insertOne("notification", {
          account_id: account.id,
          send_date: new Date(),
          read: false,
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("notification"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("should be able to read notifications", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, context } = await initDb(pool, client);
        await actAs(client, account);
        await client.query(
          "update notification set read=$2 where account_id=$1 RETURNING *",
          [account.id, true]
        );
        await client.query("COMMIT");

        await cleanup(context);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("notification"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
