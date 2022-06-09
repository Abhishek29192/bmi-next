import {
  getDbPool,
  actAs,
  RLS_ERROR,
  CONSTRAINT_ERROR,
  initDb,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;
let client;

describe("Company", () => {
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
    it("shouldn't be able to see any company if not member", async () => {
      const { company, installerSolo } = await initDb(pool, client);
      await actAs(client, installerSolo);

      const { rows } = await client.query(
        "SELECT * FROM company where id = $1",
        [company.id]
      );
      expect(rows.length).toEqual(0);
    });

    it("shouldn't be able to see another company if not member", async () => {
      const { company, otherAccount } = await initDb(pool, client);
      await actAs(client, otherAccount);

      const { rows } = await client.query(
        "SELECT * FROM company where id = $1",
        [company.id]
      );
      expect(rows.length).toEqual(0);
    });

    it("should be able to create a company with create_company", async () => {
      const { installerSolo } = await initDb(pool, client);
      await actAs(client, installerSolo);

      const { rows } = await client.query(
        "SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
      );
      expect(rows.length).toEqual(1);
    });

    it("shouldn't be able to add himself to a company", async () => {
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
      }
    });
  });

  describe("Company Admin", () => {
    it("shouldn't be able to create a company directly", async () => {
      const { installerSolo, market } = await initDb(pool, client);
      await actAs(client, installerSolo);

      const { rows } = await client.query(
        "INSERT INTO company (market_id, name) VALUES ($1, $2)",
        [market.id, "Name 123"]
      );
      expect(rows.length).toEqual(0);
    });

    it("should be able to create a company with create_company", async () => {
      const { companyAdmin } = await initDb(pool, client);
      await actAs(client, companyAdmin);

      const { rows } = await client.query(
        "SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
      );
      expect(rows.length).toEqual(1);
    });

    it("shouldn't be able to see any company if not member", async () => {
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
    });

    it("shouldn't be able to add himself to another company", async () => {
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
      }
    });
    it("shouldn't be able to create a company with the same name in a market", async () => {
      try {
        const { company, market } = await initDb(pool, client, "COMPANY_ADMIN");

        await client.query(
          "INSERT INTO company (market_id, name) VALUES ($1, $2)",
          [market.id, company.name]
        );
      } catch (error) {
        expect([
          CONSTRAINT_ERROR("company_market_id_name_key"),
          CONSTRAINT_ERROR("company_name_key")
        ]).toContain(error.message);
      }
    });
  });

  describe("Auditor", () => {
    it("should be able to see any company if not a member", async () => {
      const { auditor } = await initDb(pool, client);
      await actAs(client, auditor);

      const { rows } = await client.query("SELECT * FROM company");

      expect(rows.length).toBeGreaterThan(0);
    });

    it("shouldn't be able to add himself to a company", async () => {
      try {
        const { company, auditor, market, dbInsertOne } = await initDb(
          pool,
          client
        );
        await actAs(client, auditor);

        const companyMember = await dbInsertOne("company_member", {
          account_id: auditor.id,
          company_id: company.id,
          market_id: market.id
        });

        expect(companyMember).toBeTruthy();
      } catch (error) {
        expect(error.message).toEqual(PERMISSION_DENIED("company_member"));
      }
    });

    it("shouldn't be able to see any company from other market based on RLS", async () => {
      const { auditor, otherMarket, dbInsertOne, superAdmin } = await initDb(
        pool,
        client
      );
      await actAs(client, superAdmin);
      const otherMarketCompany = await dbInsertOne("company", {
        name: "Other Market Company",
        market_id: otherMarket.id
      });
      await actAs(client, auditor);

      const { rows } = await client.query(
        `SELECT * FROM company WHERE id = $1`,
        [otherMarketCompany.id]
      );

      expect(rows.length).toBe(0);
    });
  });
});
