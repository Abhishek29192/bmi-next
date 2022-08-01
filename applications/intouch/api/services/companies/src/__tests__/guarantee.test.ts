import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Guarantee", () => {
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

  describe("DB permissions", () => {
    describe("super admin", () => {
      it("should be able to delete a guarantee", async () => {
        const { account, company, dbInsertOne, dbDeleteRow } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        await actAs(client, account);

        const guarantee = await dbInsertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });

        expect(guarantee).toBeTruthy();

        const deletedGuarantee = await dbDeleteRow("guarantee", {
          id: guarantee.id
        });

        expect(deletedGuarantee).toBeTruthy();
      });
    });

    describe("market admin", () => {
      it("should not be able to delete a guarantee", async () => {
        const { account, dbDeleteRow } = await initDb(
          pool,
          client,
          "MARKET_ADMIN"
        );
        await actAs(client, account);

        try {
          await dbDeleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });

    describe("Company admin", () => {
      it("should be able to add a guarantee", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        await actAs(client, account);

        const guarantee = await dbInsertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });

        expect(guarantee).toBeTruthy();
      });

      it("should not be able to delete a guarantee", async () => {
        const { account, dbDeleteRow } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, account);

        try {
          await dbDeleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to create a guarantee", async () => {
        const { account, company, dbInsertOne } = await initDb(pool, client);
        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        try {
          await actAs(client, account);

          await dbInsertOne("guarantee", {
            requestor_account_id: account.id,
            project_id: project.id,
            guarantee_reference_code: "PITCHED_PRODUCT"
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });

      it("should be able to select a guarantee of his company", async () => {
        const { account, company, dbInsertOne } = await initDb(pool, client);
        const project = await dbInsertOne("project", {
          company_id: company.id
        });
        await Promise.all([
          await dbInsertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          }),
          await dbInsertOne("guarantee", {
            requestor_account_id: account.id,
            project_id: project.id,
            guarantee_reference_code: "PITCHED_PRODUCT"
          })
        ]);

        await actAs(client, account);

        const { rows: guarantees } = await client.query(
          "select * from guarantee"
        );

        expect(guarantees.length).toEqual(1);
      });

      it("should not be able to delete a guarantee", async () => {
        const { account, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, account);

        try {
          await dbDeleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });

    describe("Auditor", () => {
      it("shouldn't be able to create a guarantee", async () => {
        const { auditor, company, dbInsertOne } = await initDb(pool, client);
        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        try {
          await actAs(client, auditor);

          const guarantee = await dbInsertOne("guarantee", {
            requestor_account_id: auditor.id,
            project_id: project.id,
            guarantee_reference_code: "PITCHED_PRODUCT"
          });

          expect(guarantee).toBeNull();
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });

      it("should be able to see any guarantee", async () => {
        const { account, auditor, company, dbInsertOne } = await initDb(
          pool,
          client
        );
        const project = await dbInsertOne("project", {
          company_id: company.id
        });
        await dbInsertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });
        await actAs(client, auditor);

        const { rows: guarantees } = await client.query(
          "select * from guarantee"
        );

        expect(guarantees.length).toBeGreaterThan(0);
      });

      it("shouldn't be able to see any guarantees from other market", async () => {
        const { account, auditor, otherMarket, dbInsertOne, superAdmin } =
          await initDb(pool, client);
        await actAs(client, superAdmin);
        const otherMarketCompany = await dbInsertOne("company", {
          name: "Other Market Company",
          market_id: otherMarket.id
        });
        const project = await dbInsertOne("project", {
          company_id: otherMarketCompany.id
        });
        const guarantee = await dbInsertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });

        await actAs(client, auditor);

        const { rows: guarantees } = await client.query(
          "SELECT * FROM guarantee WHERE id = $1",
          [guarantee.id]
        );

        expect(guarantees.length).toBe(0);
      });

      it("shouldn't be able to update a guarantee", async () => {
        const { auditor, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);

        try {
          const query = await dbDeleteRow("guarantee", { id: 1 });

          expect(query).toBeTruthy();
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });

      it("shouldn't be able to delete a guarantee", async () => {
        const { auditor, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);

        try {
          const query = await dbDeleteRow("guarantee", { id: 1 });

          expect(query).toBeTruthy();
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });
  });
});
