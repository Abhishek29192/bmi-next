import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;

const initDb = async (pool, client, accountRole = "INSTALLER") => {
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
    role: accountRole,
    email: "somemail@email.com",
    market_id: market.id
  });

  const otherAccount = await insertOne("account", {
    role: accountRole,
    email: "somemail1@email.com",
    market_id: market.id
  });

  return { insertOne, account, otherAccount, market, context };
};

describe("Account", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    it("should be able to create an account using the function create_account", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const user = `null, 'NEW', null, 'INSTALLER', 'email@email.com', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', null, false, '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
        const { rows } = await client.query(
          `select * from create_account((${user}), $1)`,
          ["en"]
        );

        expect(rows.length).toEqual(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to see other accounts", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, otherAccount } = await initDb(pool, client);

        await actAs(client, otherAccount);

        const { rows } = await client.query(
          "SELECT * FROM account WHERE id = $1",
          [account.id]
        );

        expect(rows).toHaveLength(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to update the role", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account } = await initDb(pool, client);

        await actAs(client, account);

        await client.query("update account set role=$1", ["COMPANY_ADMIN"]);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("account"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Company Admin", () => {
    it("should be able to create an account using the function create_account", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const user = `null, 'NEW', null, 'COMPANY_ADMIN', 'email@email.com', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', null, false, '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
        const { rows } = await client.query(
          `select * from create_account((${user}), $1)`,
          ["en"]
        );

        expect(rows.length).toEqual(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to see other accounts", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account, otherAccount } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, otherAccount);

        const { rows } = await client.query(
          "SELECT * FROM account WHERE id = $1",
          [account.id]
        );

        expect(rows).toHaveLength(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
