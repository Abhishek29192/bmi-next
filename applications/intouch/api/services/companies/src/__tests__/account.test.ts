import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Account", () => {
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
    it("should be able to create an account using the function create_account", async () => {
      const user = `null, 'NEW', null, 'INSTALLER', 'email@email.com', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', null, false, '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
      const { rows } = await client.query(
        `select * from create_account((${user}), $1)`,
        ["en"]
      );

      expect(rows.length).toEqual(1);
    });

    it("shouldn't be able to see other accounts", async () => {
      const { account, otherAccount } = await initDb(pool, client);

      await actAs(client, otherAccount);

      const { rows } = await client.query(
        "SELECT * FROM account WHERE id = $1",
        [account.id]
      );

      expect(rows).toHaveLength(0);
    });

    it("shouldn't be able to update the role", async () => {
      try {
        const { account } = await initDb(pool, client);

        await actAs(client, account);

        await client.query("update account set role=$1", ["COMPANY_ADMIN"]);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("account"));
      }
    });
  });

  describe("Auditor", () => {
    it("should be able to create an account using the function create_account", async () => {
      const { auditor } = await initDb(pool, client);

      await actAs(client, auditor);

      const user = `null, 'NEW', null, 'AUDITOR', 'email@email.com', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', null, false, '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
      const { rows } = await client.query(
        `select * from create_account((${user}), $1)`,
        ["en"]
      );

      expect(rows.length).toBe(1);
    });

    it("shouldn't be able to see other accounts based on RLS", async () => {
      const { auditor } = await initDb(pool, client);

      await actAs(client, auditor);

      const { rows } = await client.query("SELECT * FROM account");

      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual(auditor);
    });

    it("should be able to update the basic information", async () => {
      const { auditor } = await initDb(pool, client);
      const update = [
        auditor.email,
        "1234",
        "updated_first_name",
        "updated_last_name",
        1,
        "docebo_username",
        "updated_photo",
        auditor.email
      ];

      await actAs(client, auditor);

      const { rows } = await client.query(
        "update account set email=$1, phone=$2, first_name=$3, last_name=$4, docebo_user_id=$5, docebo_username=$6, photo=$7 WHERE email=$8 RETURNING *",
        update
      );
      expect(rows.length).toBe(1);
      expect(rows[0]).toEqual(
        expect.objectContaining({
          email: update[0],
          phone: update[1],
          first_name: update[2],
          last_name: update[3],
          docebo_user_id: update[4],
          docebo_username: update[5],
          photo: update[6]
        })
      );
    });

    it("shouldn't be able to update other account based on RLS", async () => {
      const { auditor, installer } = await initDb(pool, client);
      const update = [
        installer.email,
        "1234",
        "updated_first_name",
        "updated_last_name",
        1,
        "docebo_username",
        "updated_photo"
      ];

      await actAs(client, auditor);

      const { rows } = await client.query(
        "update account set phone=$2, first_name=$3, last_name=$4, docebo_user_id=$5, docebo_username=$6, photo=$7 WHERE email=$1 RETURNING *",
        update
      );
      expect(rows.length).toBe(0);
      expect(rows[0]).not.toEqual(expect.objectContaining(update));
    });

    it("shouldn't be able to update the role", async () => {
      try {
        const { auditor } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query(
          "update account set role=$1 RETURNING *",
          ["INSTALLER"]
        );
        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("account"));
      }
    });
  });

  describe("Company Admin", () => {
    it("should be able to create an account using the function create_account", async () => {
      const user = `null, 'NEW', null, 'COMPANY_ADMIN', 'email@email.com', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', null, false, '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
      const { rows } = await client.query(
        `select * from create_account((${user}), $1)`,
        ["en"]
      );

      expect(rows.length).toEqual(1);
    });

    it("shouldn't be able to see other accounts", async () => {
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
    });
  });
});
