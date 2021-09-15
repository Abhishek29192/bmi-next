import { Role } from "@bmi/intouch-api-types";
import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;
let client;
let context;
let insertOne;

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
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  describe("DB permissions", () => {
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
    });
  });
});
