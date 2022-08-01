import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Company Document", () => {
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

  describe("Company Admin", () => {
    it("should be able to add a document to his company", async () => {
      const { companyAdmin, company, dbInsertOne } = await initDb(pool, client);

      await actAs(client, companyAdmin);

      const doc = await dbInsertOne("company_document", {
        company_id: company.id
      });

      expect(doc).not.toBeNull();
    });

    it("shouldn't be able to add a document to another company", async () => {
      try {
        const { companyAdmin, otherCompany, dbInsertOne } = await initDb(
          pool,
          client
        );

        await actAs(client, companyAdmin);

        await dbInsertOne("company_document", {
          company_id: otherCompany.id
        });
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_document"));
      }
    });

    it("shouldn't be able to read a document of another company", async () => {
      try {
        const { companyAdmin, otherDocument } = await initDb(pool, client);

        await actAs(client, companyAdmin);

        await client.query("SELECT * FROM company_document WHERE id = $1", [
          otherDocument.id
        ]);
      } catch (error) {
        expect(error.message).toEqual(RLS_ERROR("company_document"));
      }
    });
  });

  describe("Installer", () => {
    it("shouldn't be able to add a document to another company", async () => {
      try {
        const { installer, otherCompany, dbInsertOne } = await initDb(
          pool,
          client
        );

        await actAs(client, installer);

        await dbInsertOne("company_document", {
          company_id: otherCompany.id
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });

    it("shouldn't be able to add a document his company", async () => {
      try {
        const { installer, company, dbInsertOne } = await initDb(pool, client);

        await actAs(client, installer);

        await dbInsertOne("company_document", {
          company_id: company.id
        });
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });

    it("shouldn be able to read a document of his company", async () => {
      const { installer, document } = await initDb(pool, client);

      await actAs(client, installer);

      const { rows } = await client.query(
        "SELECT * FROM company_document WHERE id = $1",
        [document.id]
      );

      expect(rows).toHaveLength(1);
    });

    it("shouldn be able to read a document of another company", async () => {
      const { installer, otherDocument } = await initDb(pool, client);

      await actAs(client, installer);

      const { rows } = await client.query(
        "SELECT * FROM company_document WHERE id = $1",
        [otherDocument.id]
      );

      expect(rows).toHaveLength(0);
    });
  });

  describe("Auditor", () => {
    it("shouldn't be able to add a document to another company", async () => {
      try {
        const { auditor, otherCompany, dbInsertOne } = await initDb(
          pool,
          client
        );

        await actAs(client, auditor);

        const document = await dbInsertOne("company_document", {
          company_id: otherCompany.id
        });

        expect(document).toBeNull();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });

    it("shouldn't be able to read a document of another company", async () => {
      try {
        const { auditor, otherDocument } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query(
          "SELECT * FROM company_document WHERE id = $1",
          [otherDocument.id]
        );

        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });

    it("shouldn't be able to add a document", async () => {
      try {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "AUDITOR"
        );

        await actAs(client, account);

        const document = await dbInsertOne("company_document", {
          company_id: company.id
        });

        expect(document).toBeNull();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });

    it("shouldn't not be able to read a document", async () => {
      try {
        const { account, document } = await initDb(pool, client, "AUDITOR");

        await actAs(client, account);

        const { rows } = await client.query(
          "SELECT * FROM company_document WHERE id = $1",
          [document.id]
        );

        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
      }
    });
  });
});
