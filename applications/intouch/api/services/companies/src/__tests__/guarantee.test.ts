import { Role } from "@bmi/intouch-api-types";
import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  deleteRow as dbDeleteRow,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;
let client;
let context;
let insertOne;
let deleteRow;

// TODO: this is the same as in project. Reusable?
// OR just this is in some common utils, and then we can add more thing?
const setupData = async (role: Role) => {
  const market = await insertOne("market", {
    domain: "MARKET_DOMAIN",
    language: "en",
    projects_enabled: true
  });

  const [company, account] = await Promise.all([
    insertOne("company", {
      market_id: market.id
    }),
    insertOne("account", {
      role,
      market_id: market.id
    })
  ]);

  await insertOne("company_member", {
    account_id: account.id,
    company_id: company.id,
    market_id: market.id
  });

  return {
    market,
    company,
    account
  };
};

describe("Guarantee", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    client = await pool.connect();
    context = {
      client,
      cleanupBucket: {}
    };
    await client.query("BEGIN");

    insertOne = curryContext(context, dbInsertOne);
    deleteRow = curryContext(context, dbDeleteRow);
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  describe("DB permissions", () => {
    describe("super admin", () => {
      it("should be able to delete a guarantee", async () => {
        const { account, company } = await setupData("SUPER_ADMIN");
        const project = await insertOne("project", {
          company_id: company.id
        });

        await actAs(client, account);

        const guarantee = await insertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });

        expect(guarantee).toBeTruthy();

        const deletedGuarantee = await deleteRow("guarantee", {
          id: guarantee.id
        });

        expect(deletedGuarantee).toBeTruthy();
      });
    });

    describe("market admin", () => {
      it("should not be able to delete a guarantee", async () => {
        const { account } = await setupData("MARKET_ADMIN");
        await actAs(client, account);

        try {
          await deleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });

    describe("Company admin", () => {
      it("should be able to add a guarantee", async () => {
        const { account, company } = await setupData("COMPANY_ADMIN");
        const project = await insertOne("project", {
          company_id: company.id
        });

        await actAs(client, account);

        const guarantee = await insertOne("guarantee", {
          requestor_account_id: account.id,
          project_id: project.id,
          guarantee_reference_code: "PITCHED_PRODUCT"
        });

        expect(guarantee).toBeTruthy();
      });

      it("should not be able to delete a guarantee", async () => {
        const { account } = await setupData("COMPANY_ADMIN");

        await actAs(client, account);

        try {
          await deleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to create a guarantee", async () => {
        const { account, company } = await setupData("INSTALLER");
        const project = await insertOne("project", {
          company_id: company.id
        });

        try {
          await actAs(client, account);

          await insertOne("guarantee", {
            requestor_account_id: account.id,
            project_id: project.id,
            guarantee_reference_code: "PITCHED_PRODUCT"
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });

      it("should be able to select a guarantee of his company", async () => {
        const { account, company } = await setupData("INSTALLER");
        const project = await insertOne("project", {
          company_id: company.id
        });
        await Promise.all([
          await insertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          }),
          await insertOne("guarantee", {
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
        const { account } = await setupData("INSTALLER");

        await actAs(client, account);

        try {
          await deleteRow("guarantee", { id: 1 });
        } catch (error) {
          expect(error.message).toBe(PERMISSION_DENIED("guarantee"));
        }
      });
    });
  });
});
