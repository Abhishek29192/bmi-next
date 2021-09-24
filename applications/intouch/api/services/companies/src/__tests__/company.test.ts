import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  RLS_ERROR
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

  const installerSolo = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail2@email.com",
    market_id: market.id
  });

  const companyAdminSolo = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail0@email.com",
    market_id: market.id
  });

  const company = await insertOne("company", {
    name: "Name 2",
    market_id: market.id
  });

  const account = await insertOne("account", {
    role: accountRole,
    email: "somemail@email.com",
    market_id: market.id
  });

  const otherCompany = await insertOne("company", {
    name: "Name 1",
    market_id: market.id
  });

  const otherAccount = await insertOne("account", {
    role: accountRole,
    email: "somemail1@email.com",
    market_id: market.id
  });

  await insertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: account.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherAccount.id
  });

  return {
    insertOne,
    account,
    company,
    otherAccount,
    otherCompany,
    market,
    context,
    installerSolo,
    companyAdminSolo
  };
};

describe("Company", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    it("shouldn't be able to see any company if not member", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { company, installerSolo } = await initDb(pool, client);
        await actAs(client, installerSolo);

        const { rows } = await client.query(
          "SELECT * FROM company where id = $1",
          [company.id]
        );
        expect(rows.length).toEqual(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to see another company if not member", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { company, otherAccount } = await initDb(pool, client);
        await actAs(client, otherAccount);

        const { rows } = await client.query(
          "SELECT * FROM company where id = $1",
          [company.id]
        );
        expect(rows.length).toEqual(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("should be able to create a company with create_company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installerSolo } = await initDb(pool, client);
        await actAs(client, installerSolo);

        const { rows } = await client.query(
          "SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
          ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
        );
        expect(rows.length).toEqual(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to add himself to a company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { company, installerSolo, market } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, installerSolo);

        await client.query(
          "insert into company_member (account_id, company_id, market_id) VALUES($1, $2, $3) RETURNING *",
          [installerSolo.id, company.id, market.id]
        );
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_member"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to create a company directly", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installerSolo, market } = await initDb(pool, client);
        await actAs(client, installerSolo);

        const { rows } = await client.query(
          "INSERT INTO company (market_id, name) VALUES ($1, $2)",
          [market.id, "Name 123"]
        );
        expect(rows.length).toEqual(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("should be able to create a company with create_company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { companyAdminSolo } = await initDb(pool, client);
        await actAs(client, companyAdminSolo);

        const { rows } = await client.query(
          "SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
          ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
        );
        expect(rows.length).toEqual(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to see any company if not member", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { company, otherAccount } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, otherAccount);

        const { rows } = await client.query(
          "SELECT * FROM company where id = $1",
          [company.id]
        );
        expect(rows.length).toEqual(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to add himself to another company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { company, otherAccount, market } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        await actAs(client, otherAccount);

        await client.query(
          "insert into company_member (account_id, company_id, market_id) VALUES($1, $2, $3) RETURNING *",
          [otherAccount.id, company.id, market.id]
        );
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_member"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
