import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;

const initDb = async (client, accountRole) => {
  const context = {
    client,
    cleanupBucket: {}
  };
  const insertOne = curryContext(context, dbInsertOne);
  const market = await insertOne("market", {
    domain: "da",
    language: "da"
  });

  const installerSolo = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail1@email.com",
    market_id: market.id
  });

  const account = await insertOne("account", {
    role: accountRole,
    email: "somemail@email.com",
    market_id: market.id
  });

  const company = await insertOne("company", {
    name: "Name 2",
    market_id: market.id
  });

  const invitation = await insertOne("invitation", {
    sender_account_id: account.id,
    company_id: company.id,
    invitee: "email@email.com",
    personal_note:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    status: "NEW"
  });

  return { insertOne, account, company, market, invitation, installerSolo };
};

describe("Invitation", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    it("shouldn't be able to send an invitation", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { account } = await initDb(client, "INSTALLER");

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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("a user with an invitation should be able to join a company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installerSolo, company } = await initDb(client, "INSTALLER");

        await actAs(client, installerSolo);

        const { rows } = await client.query(
          "select * from link_account_to_company($1,$2)",
          [installerSolo.id, company.id]
        );
        expect(rows.length).toEqual(1);
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
        const { account, company } = await initDb(client, "COMPANY_ADMIN");

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
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
