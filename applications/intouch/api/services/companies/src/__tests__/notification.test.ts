import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Notification", () => {
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

  describe("Installer", () => {
    it("shouldn't be able to create a notification", async () => {
      try {
        const { account, dbInsertOne } = await initDb(pool, client);

        await actAs(client, account);

        await dbInsertOne("notification", {
          account_id: account.id,
          send_date: new Date(),
          read: false,
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("notification"));
      }
    });

    it("should be able to update his notifications to read", async () => {
      const { account, dbInsertOne, superAdmin } = await initDb(pool, client);
      await actAs(client, superAdmin);
      await dbInsertOne("notification", {
        account_id: account.id,
        send_date: new Date(),
        read: false,
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
      });
      await actAs(client, account);
      const { rows } = await client.query(
        "update notification set read=$2 where account_id=$1 RETURNING *",
        [account.id, true]
      );

      expect(rows.length).toBe(1);
    });
  });

  describe("Auditor", () => {
    it("should be return empty array when SELECT based on RLS", async () => {
      const { auditor, account, dbInsertOne, superAdmin } = await initDb(
        pool,
        client
      );
      await actAs(client, superAdmin);
      await dbInsertOne("notification", {
        account_id: account.id,
        send_date: new Date(),
        read: false,
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
      });
      await actAs(client, auditor);
      const { rows } = await client.query("SELECT * FROM notification");

      expect(rows.length).toBe(0);
    });

    it("shouldn't be able to create a notification", async () => {
      try {
        const { auditor, dbInsertOne } = await initDb(pool, client);

        await actAs(client, auditor);

        await dbInsertOne("notification", {
          account_id: auditor.id,
          send_date: new Date(),
          read: false,
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("notification"));
      }
    });

    it("shouldn't be able to update his notifications to read", async () => {
      try {
        const { auditor, dbInsertOne, superAdmin } = await initDb(pool, client);
        await actAs(client, superAdmin);
        await dbInsertOne("notification", {
          account_id: auditor.id,
          send_date: new Date(),
          read: false,
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        });
        await actAs(client, auditor);
        const { rows } = await client.query(
          "update notification set read=$2 where account_id=$1 RETURNING *",
          [auditor.id, true]
        );

        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("notification"));
      }
    });
  });
});
