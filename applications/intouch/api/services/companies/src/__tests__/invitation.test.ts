import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Invitation", () => {
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
    it("shouldn't be able to send an invitation", async () => {
      try {
        const { account } = await initDb(pool, client, "INSTALLER");

        await actAs(client, account);

        await client.query(
          "insert into invitation (sender_account_id, invitee, personal_note, status) VALUES ($1, $2, $3, $4) RETURNING *",
          [
            account.id,
            "email@email.com",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            "NEW"
          ]
        );
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("invitation"));
      }
    });

    it("a user with an invitation should be able to join a company", async () => {
      const { installerSolo, company } = await initDb(
        pool,
        client,
        "INSTALLER"
      );

      await actAs(client, installerSolo);

      const { rows } = await client.query(
        "select * from link_account_to_company($1,$2)",
        [installerSolo.id, company.id]
      );
      expect(rows.length).toEqual(1);
    });
  });

  describe("Auditor", () => {
    it("SELECT", async () => {
      try {
        const { auditor } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query("SELECT * FROM invitation");

        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("invitation"));
      }
    });

    it("INSERT", async () => {
      try {
        const { auditor, account, dbInsertOne } = await initDb(pool, client);

        await actAs(client, auditor);

        const invitation = await dbInsertOne("invitation", {
          sender_account_id: account.id,
          invitee: "email@email.com",
          personal_note:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          status: "NEW"
        });

        expect(invitation).toBeNull();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("invitation"));
      }
    });

    it("DELETE", async () => {
      try {
        const { auditor, invitation, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);

        const query = await dbDeleteRow("invitation", {
          id: invitation.id
        });

        expect(query).toBeTruthy();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("invitation"));
      }
    });
  });

  describe("Company Admin", () => {
    it("should be able to send an invitation", async () => {
      const { account, company } = await initDb(pool, client, "COMPANY_ADMIN");

      await actAs(client, account);

      const { rows } = await client.query(
        "insert into invitation (sender_account_id, company_id, invitee, personal_note, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          account.id,
          company.id,
          "email@email.com",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          "NEW"
        ]
      );
      expect(rows).toHaveLength(1);
    });
  });
});
