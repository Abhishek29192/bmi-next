import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED,
  RLS_ERROR
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

  const admin = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail0@email.com",
    market_id: market.id
  });

  const installer = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail1@email.com",
    market_id: market.id
  });

  const company = await insertOne("company", {
    name: "Company 1",
    market_id: market.id
  });

  const otherAdmin = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail2@email.com",
    market_id: market.id
  });

  const otherInstaller = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail3@email.com",
    market_id: market.id
  });

  const otherCompany = await insertOne("company", {
    name: "Company 2",
    market_id: market.id
  });

  await insertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: installer.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: admin.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherInstaller.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherAdmin.id
  });

  const document = await insertOne("company_document", {
    company_id: company.id
  });

  const otherDocument = await insertOne("company_document", {
    company_id: otherCompany.id
  });

  return {
    insertOne,
    market,
    installer,
    otherInstaller,
    otherCompany,
    admin,
    otherAdmin,
    company,
    document,
    otherDocument
  };
};

describe("Company Document", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Company Admin", () => {
    it("should be able to add a document to his company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, company, insertOne } = await initDb(client);

        await actAs(client, admin);

        const doc = await insertOne("company_document", {
          company_id: company.id
        });

        expect(doc).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to add a document to another company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, otherCompany, insertOne } = await initDb(client);

        await actAs(client, admin);

        await insertOne("company_document", {
          company_id: otherCompany.id
        });
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_document"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to read a document of another company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { admin, otherDocument } = await initDb(client);

        await actAs(client, admin);

        await client.query("SELECT * FROM company_document WHERE id = $1", [
          otherDocument.id
        ]);
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_document"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to add a document to another company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installer, otherCompany, insertOne } = await initDb(client);

        await actAs(client, installer);

        await insertOne("company_document", {
          company_id: otherCompany.id
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn't be able to add a document his company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installer, company, insertOne } = await initDb(client);

        await actAs(client, installer);

        await insertOne("company_document", {
          company_id: company.id
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn be able to read a document of his company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installer, document } = await initDb(client);

        await actAs(client, installer);

        const { rows } = await client.query(
          "SELECT * FROM company_document WHERE id = $1",
          [document.id]
        );

        expect(rows).toHaveLength(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    it("shouldn be able to read a document of another company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { installer, otherDocument } = await initDb(client);

        await actAs(client, installer);

        const { rows } = await client.query(
          "SELECT * FROM company_document WHERE id = $1",
          [otherDocument.id]
        );

        expect(rows).toHaveLength(0);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
