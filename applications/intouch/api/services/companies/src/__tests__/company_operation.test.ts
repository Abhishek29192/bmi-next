import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED,
  RLS_ERROR
} from "../test-utils/db";

let pool;

const setupCompanyOpTest = async (client, accountRole) => {
  const context = {
    client,
    cleanupBucket: {}
  };
  const insertOne = curryContext(context, dbInsertOne);
  const market = await insertOne("market", {
    domain: "aa",
    language: "da"
  });
  const otherMarket = await insertOne("market", {
    domain: "dd",
    language: "sk"
  });
  const account = await insertOne("account", {
    role: accountRole,
    email: "somemail@email.com",
    market_id: market.id
  });
  const company = await insertOne("company", {
    market_id: market.id,
    name: "test"
  });
  const otherCompany = await insertOne("company", {
    market_id: otherMarket.id,
    name: "other"
  });

  if (["INSTALLER", "COMPANY_ADMIN"].includes(accountRole)) {
    await insertOne("company_member", {
      market_id: market.id,
      company_id: company.id,
      account_id: account.id
    });
  }
  return { insertOne, account, market, otherMarket, company, otherCompany };
};

describe("Company Operation", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("DB permissions", () => {
    describe("Super Admin", () => {
      describe("INSERT", () => {
        it("should be able to add a company_operation for a company in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company } = await setupCompanyOpTest(
              client,
              "SUPER_ADMIN"
            );
            await actAs(client, account);

            const { rows: insertedCompanyOps } = await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [company.id, "PITCHED"]
            );
            expect(insertedCompanyOps.length).toEqual(1);
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });

        it("should not be able to add a company_operation for a company not in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");
          try {
            const { account, otherCompany } = await setupCompanyOpTest(
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
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });

      describe("DELETE", () => {
        it("should be able to delete a company_operation for a company in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company, insertOne } = await setupCompanyOpTest(
              client,
              "SUPER_ADMIN"
            );
            const companyOperation = await insertOne("company_operation", {
              company: company.id,
              operation: "FLAT"
            });

            await actAs(client, account);

            const { rows: deletedCompanyOps } = await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [companyOperation.id]
            );
            expect(deletedCompanyOps.length).toEqual(1);
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });

        it("should not be able to delete a company_operation for a company not in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");
          try {
            const { account, otherCompany, insertOne } =
              await setupCompanyOpTest(client, "SUPER_ADMIN");

            const otherCompanyOperation = await insertOne("company_operation", {
              company: otherCompany.id,
              operation: "FLAT"
            });
            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [otherCompanyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });
    });

    describe("Market Admin", () => {
      describe("INSERT", () => {
        it("should be able to add a company_operation for a company in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company } = await setupCompanyOpTest(
              client,
              "MARKET_ADMIN"
            );
            await actAs(client, account);

            const { rows: insertedCompanyOps } = await client.query(
              "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
              [company.id, "PITCHED"]
            );
            expect(insertedCompanyOps.length).toEqual(1);
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });

        it("should not be able to add a company_operation for a company not in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");
          try {
            const { account, otherCompany } = await setupCompanyOpTest(
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
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });

      describe("DELETE", () => {
        it("should be able to delete a company_operation for a company in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company, insertOne } = await setupCompanyOpTest(
              client,
              "MARKET_ADMIN"
            );
            const companyOperation = await insertOne("company_operation", {
              company: company.id,
              operation: "FLAT"
            });

            await actAs(client, account);

            const { rows: deletedCompanyOps } = await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [companyOperation.id]
            );
            expect(deletedCompanyOps.length).toEqual(1);
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });

        it("should not be able to delete a company_operation for a company not in their market", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");
          try {
            const { account, otherCompany, insertOne } =
              await setupCompanyOpTest(client, "MARKET_ADMIN");
            const otherCompanyOperation = await insertOne("company_operation", {
              company: otherCompany.id,
              operation: "FLAT"
            });

            await actAs(client, account);

            await client.query(
              "delete from company_operation WHERE id = $1 RETURNING *",
              [otherCompanyOperation.id]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_operation"));
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });
    });

    describe("Company Admin", () => {
      describe("SELECT", () => {
        it("should be able to view company_operations for their company only", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company, otherCompany, insertOne } =
              await setupCompanyOpTest(client, "COMPANY_ADMIN");
            const operation1 = await insertOne("company_operation", {
              company: company.id,
              operation: "SOLAR"
            });
            const operation2 = await insertOne("company_operation", {
              company: company.id,
              operation: "PITCHED"
            });
            await insertOne("company_operation", {
              company: otherCompany.id,
              operation: "BITUMEN"
            });

            await actAs(client, account);

            const { rows } = await client.query(
              "select * from company_operation WHERE company = $1",
              [company.id]
            );
            expect(rows).toEqual([operation1, operation2]);
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });

      describe("INSERT", () => {
        it("should not be able to add a company_operation", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company } = await setupCompanyOpTest(
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
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });

      describe("DELETE", () => {
        it("should not be able to delete a company_operation for their company", async () => {
          const client = await pool.connect();
          await client.query("BEGIN");

          try {
            const { account, company, insertOne } = await setupCompanyOpTest(
              client,
              "COMPANY_ADMIN"
            );

            const companyOperation = await insertOne("company_operation", {
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
          } finally {
            await client.query("ROLLBACK");
            client.release();
          }
        });
      });
    });
  });

  describe("Installer", () => {
    describe("SELECT", () => {
      it("should be able to view company_operations for their company only", async () => {
        const client = await pool.connect();
        await client.query("BEGIN");

        try {
          const { account, company, otherCompany, insertOne } =
            await setupCompanyOpTest(client, "INSTALLER");
          const operation1 = await insertOne("company_operation", {
            company: company.id,
            operation: "SOLAR"
          });
          const operation2 = await insertOne("company_operation", {
            company: company.id,
            operation: "PITCHED"
          });
          await insertOne("company_operation", {
            company: otherCompany.id,
            operation: "BITUMEN"
          });

          await actAs(client, account);

          const { rows } = await client.query(
            "select * from company_operation WHERE company = $1",
            [company.id]
          );
          expect(rows).toEqual([operation1, operation2]);
        } finally {
          await client.query("ROLLBACK");
          client.release();
        }
      });
    });

    describe("INSERT", () => {
      it("should not be able to add a company_operation", async () => {
        const client = await pool.connect();
        await client.query("BEGIN");

        try {
          const { account, company } = await setupCompanyOpTest(
            client,
            "INSTALLER"
          );
          await actAs(client, account);

          await client.query(
            "insert into company_operation (company, operation) VALUES($1, $2) RETURNING *",
            [company.id, "PITCHED"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("company_operation"));
        } finally {
          await client.query("ROLLBACK");
          client.release();
        }
      });
    });

    describe("DELETE", () => {
      it("should not be able to delete a company_operation for the company they belong to", async () => {
        const client = await pool.connect();
        await client.query("BEGIN");

        try {
          const { account, company, insertOne } = await setupCompanyOpTest(
            client,
            "INSTALLER"
          );
          const companyOperation = await insertOne("company_operation", {
            company: company.id,
            operation: "FLAT"
          });

          await actAs(client, account);

          await client.query(
            "delete from company_operation WHERE id = $1 RETURNING *",
            [companyOperation.id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("company_operation"));
        } finally {
          await client.query("ROLLBACK");
          client.release();
        }
      });
    });
  });
});
