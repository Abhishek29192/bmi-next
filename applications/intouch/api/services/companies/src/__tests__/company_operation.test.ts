import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Company Operation", () => {
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
    describe("Super Admin", () => {
      describe("INSERT", () => {
        it("should be able to add a company_operation for a company in their market", async () => {
          const { account, company } = await initDb(
            pool,
            client,
            "SUPER_ADMIN"
          );
          await actAs(client, account);

          const { rows: insertedCompanyOps } = await client.query(
            "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
            [company.id, "PITCHED"]
          );
          expect(insertedCompanyOps.length).toEqual(1);
        });

        it("should not be able to add a company_operation for a company not in their market", async () => {
          try {
            const { account, otherCompany } = await initDb(
              pool,
              client,
              "SUPER_ADMIN"
            );
            await actAs(client, account);

            await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [otherCompany.id, "PITCHED"]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          }
        });
      });

      describe("DELETE", () => {
        it("should be able to delete a company_operation for a company in their market", async () => {
          const { account, company, dbInsertOne } = await initDb(
            pool,
            client,
            "SUPER_ADMIN"
          );
          const companyOperation = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "FLAT"
          });

          await actAs(client, account);

          const { rows: deletedCompanyOps } = await client.query(
            "delete from company_operation WHERE id = $1 RETURNING *",
            [companyOperation.id]
          );
          expect(deletedCompanyOps.length).toEqual(1);
        });

        it("should not be able to delete a company_operation for a company not in their market", async () => {
          try {
            const { account, otherCompany, dbInsertOne } = await initDb(
              pool,
              client,
              "SUPER_ADMIN"
            );

            const otherCompanyOperation = await dbInsertOne(
              "company_operation",
              {
                company: otherCompany.id,
                operation: "FLAT"
              }
            );
            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [otherCompanyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          }
        });
      });
    });

    describe("Market Admin", () => {
      describe("INSERT", () => {
        it("should be able to add a company_operation for a company in their market", async () => {
          const { account, company } = await initDb(
            pool,
            client,
            "MARKET_ADMIN"
          );
          await actAs(client, account);

          const { rows: insertedCompanyOps } = await client.query(
            "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
            [company.id, "PITCHED"]
          );
          expect(insertedCompanyOps.length).toEqual(1);
        });

        it("should not be able to add a company_operation for a company not in their market", async () => {
          try {
            const { account, otherCompany } = await initDb(
              pool,
              client,
              "MARKET_ADMIN"
            );
            await actAs(client, account);

            await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [otherCompany.id, "PITCHED"]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          }
        });
      });

      describe("DELETE", () => {
        it("should be able to delete a company_operation for a company in their market", async () => {
          const { account, company, dbInsertOne } = await initDb(
            pool,
            client,
            "MARKET_ADMIN"
          );
          const companyOperation = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "FLAT"
          });

          await actAs(client, account);

          const { rows: deletedCompanyOps } = await client.query(
            "delete from company_operation WHERE id = $1 RETURNING *",
            [companyOperation.id]
          );
          expect(deletedCompanyOps.length).toEqual(1);
        });

        it("should not be able to delete a company_operation for a company not in their market", async () => {
          try {
            const { account, otherCompany, dbInsertOne } = await initDb(
              pool,
              client,
              "MARKET_ADMIN"
            );
            const otherCompanyOperation = await dbInsertOne(
              "company_operation",
              {
                company: otherCompany.id,
                operation: "FLAT"
              }
            );

            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [otherCompanyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          }
        });
      });
    });

    describe("Company Admin", () => {
      describe("SELECT", () => {
        it("should be able to view company_operations for their company only", async () => {
          const { account, company, otherCompany, dbInsertOne } = await initDb(
            pool,
            client,
            "COMPANY_ADMIN"
          );
          const operation1 = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "SOLAR"
          });
          const operation2 = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "PITCHED"
          });
          await dbInsertOne("company_operation", {
            company: otherCompany.id,
            operation: "BITUMEN"
          });

          await actAs(client, account);

          const { rows } = await client.query(
            "select * from company_operation WHERE company = $1",
            [company.id]
          );
          expect(rows).toEqual([operation1, operation2]);
        });
      });

      describe("INSERT", () => {
        it("should not be able to add a company_operation", async () => {
          try {
            const { account, company } = await initDb(
              pool,
              client,
              "COMPANY_ADMIN"
            );
            await actAs(client, account);

            await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [company.id, "PITCHED"]
            );
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });

      describe("DELETE", () => {
        it("should not be able to delete a company_operation for their company", async () => {
          try {
            const { account, company, dbInsertOne } = await initDb(
              pool,
              client,
              "COMPANY_ADMIN"
            );

            const companyOperation = await dbInsertOne("company_operation", {
              company: company.id,
              operation: "FLAT"
            });

            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [companyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });
    });

    describe("Installer", () => {
      describe("SELECT", () => {
        it("should be able to view company_operations for their company only", async () => {
          const { account, company, otherCompany, dbInsertOne } = await initDb(
            pool,
            client,
            "INSTALLER"
          );
          const operation1 = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "SOLAR"
          });
          const operation2 = await dbInsertOne("company_operation", {
            company: company.id,
            operation: "PITCHED"
          });
          await dbInsertOne("company_operation", {
            company: otherCompany.id,
            operation: "BITUMEN"
          });

          await actAs(client, account);

          const { rows } = await client.query(
            "select * from company_operation WHERE company = $1",
            [company.id]
          );
          expect(rows).toEqual([operation1, operation2]);
        });
      });

      describe("INSERT", () => {
        it("should not be able to add a company_operation", async () => {
          try {
            const { account, company } = await initDb(
              pool,
              client,
              "INSTALLER"
            );
            await actAs(client, account);

            await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [company.id, "PITCHED"]
            );
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });

      describe("DELETE", () => {
        it("should not be able to delete a company_operation for the company they belong to", async () => {
          try {
            const { account, company, dbInsertOne } = await initDb(
              pool,
              client,
              "INSTALLER"
            );
            const companyOperation = await dbInsertOne("company_operation", {
              company: company.id,
              operation: "FLAT"
            });

            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [companyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });
    });

    describe("Auditor", () => {
      describe("SELECT", () => {
        it("should be return empty company_operations under RLS", async () => {
          const { auditor, company, otherCompany, dbInsertOne } = await initDb(
            pool,
            client
          );
          await dbInsertOne("company_operation", {
            company: company.id,
            operation: "SOLAR"
          });
          await dbInsertOne("company_operation", {
            company: company.id,
            operation: "PITCHED"
          });
          await dbInsertOne("company_operation", {
            company: otherCompany.id,
            operation: "BITUMEN"
          });
          await actAs(client, auditor);

          const { rows } = await client.query(
            "SELECT * FROM company_operation"
          );

          expect(rows.length).toBe(0);
        });
      });

      describe("INSERT", () => {
        it("should not be able to add a company_operation", async () => {
          try {
            const { auditor, company, dbInsertOne } = await initDb(
              pool,
              client
            );
            await actAs(client, auditor);

            const companyOperation = await dbInsertOne("company_operation", {
              company: company.id,
              operation: "PITCHED"
            });

            expect(companyOperation).toBeNull();
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });

      describe("DELETE", () => {
        it("should not be able to delete a company_operation for the company they belong to", async () => {
          try {
            const { auditor, company, dbInsertOne, dbDeleteRow } = await initDb(
              pool,
              client
            );
            const companyOperation = await dbInsertOne("company_operation", {
              company: company.id,
              operation: "FLAT"
            });

            await actAs(client, auditor);

            const query = await dbDeleteRow("company_operation", {
              id: companyOperation.id
            });

            expect(query).toBeTruthy();
          } catch (error) {
            expect(error.message).toEqual(
              PERMISSION_DENIED("company_operation")
            );
          }
        });
      });
    });
  });
});
