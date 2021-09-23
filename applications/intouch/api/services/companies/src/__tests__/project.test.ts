import { Role } from "@bmi/intouch-api-types";
import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED,
  RLS_ERROR
} from "../test-utils/db";

let pool;
let client;
let context;
let insertOne;

// TODO: Not entirely happy this uses global insertOne
// but maybe it's "acceptable" conside tests already leverage file scope
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

describe("Project", () => {
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
    describe("Super Admin", () => {});

    describe("Company admin", () => {
      it("should be able to add a project", async () => {
        const { account, company } = await setupData("COMPANY_ADMIN");

        await actAs(client, account);

        const project = insertOne("project", {
          company_id: company.id
        });

        expect(project).toBeTruthy();
      });

      it("should not be able to see a hidden project", async () => {
        const { account, company } = await setupData("COMPANY_ADMIN");

        // Setup, without authorization
        const project = await insertOne("project", {
          company_id: company.id,
          hidden: true
        });
        await insertOne("project_member", {
          project_id: project.id,
          account_id: account.id
        });

        await actAs(client, account);

        const { rows: projects } = await client.query("select * from project");

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to add a project to another company", async () => {
        const { account } = await setupData("COMPANY_ADMIN");
        // TODO: setup separate company I guess to try to insert with that ID
        const otherMarket = await insertOne("market", {
          domain: "OTHER_MARKET_DOMAIN",
          language: "en",
          projects_enabled: true
        });

        const otherCompany = await insertOne("company", {
          market_id: otherMarket.id
        });

        try {
          await actAs(client, account);
          await insertOne("project", {
            company_id: otherCompany.id
          });
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("project"));
        }
      });

      it("should be able to add an installer to the project", async () => {
        const {
          market,
          account: companyAdminAccount,
          company
        } = await setupData("COMPANY_ADMIN");

        const project = await insertOne("project", {
          company_id: company.id
        });

        const installerAccount = await insertOne("account", {
          role: "INSTALLER",
          market_id: market.id,
          // Specify email so it doesn't clash with account from setupDate
          email: "installer@email.invalid"
        });

        await actAs(client, companyAdminAccount);
        const projectMember = await insertOne("project_member", {
          project_id: project.id,
          account_id: installerAccount.id
        });

        expect(projectMember).toBeTruthy();
      });
    });

    describe("Market Admin", () => {
      it("should not be able to see projects outside of own market", async () => {
        // NOTE: Projects get market via company
        const otherMarket = await insertOne("market", {
          domain: "OTHER_MARKET_DOMAIN",
          language: "en"
        });
        const company = await insertOne("company", {
          market_id: otherMarket.id
        });
        await insertOne("project", {
          company_id: company.id,
          technology: "PITCHED"
        });

        // Separate market, separate account
        const myMarket = await insertOne("market", {
          domain: "MY_MARKET_DOMAIN",
          language: "en"
        });
        const myCompany = await insertOne("company", {
          market_id: myMarket.id
        });
        await insertOne("project", {
          name: "My Project",
          company_id: myCompany.id,
          technology: "PITCHED"
        });
        // NOTE: account is not related to company,
        // market adming sees all projects in own market
        const account = await insertOne("account", {
          role: "MARKET_ADMIN",
          market_id: myMarket.id
        });

        await actAs(client, account);

        const { rows: visibleProjects } = await client.query(
          "select * from project"
        );

        // Verifies that the user sees only one project in their market
        // and not the other one, not in their market
        expect(visibleProjects.length).toEqual(1);
        expect(visibleProjects[0].name).toEqual("My Project");
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to see projects of other companies", async () => {
        const { account } = await setupData("INSTALLER");

        await actAs(client, account);
        const { rows: projects } = await client.query(
          "select * from project where company_id != (select * from current_company())"
        );

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to see hidden project", async () => {
        const { account, company } = await setupData("INSTALLER");

        // Setup, without authorization
        const createdProject = await insertOne("project", {
          company_id: company.id,
          hidden: true
        });
        await insertOne("project_member", {
          project_id: createdProject.id,
          account_id: account.id
        });

        await actAs(client, account);
        const { rows: projects } = await client.query("select * from project");

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to add an installer to the project", async () => {
        const { account, company } = await setupData("INSTALLER");

        const project = await insertOne("project", {
          company_id: company.id
        });

        try {
          await insertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });

      it("should be able to remove themselves from a project", async () => {
        const { account, company } = await setupData("INSTALLER");

        // Setup, without authorization
        const project = await insertOne("project", {
          company_id: company.id
        });
        await insertOne("project_member", {
          project_id: project.id,
          account_id: account.id
        });

        await actAs(client, account);
        const { rows: deletedRows } = await client.query(
          "delete from project_member where account_id = $1 returning id",
          [account.id]
        );
        expect(deletedRows.length).toEqual(1);
      });

      it("should not be able to remove another account from a project", async () => {
        const { market, account, company } = await setupData("INSTALLER");

        // Setup, without authorization
        const otherInstallerAccount = await insertOne("account", {
          role: "INSTALLER",
          market_id: market.id,
          email: "anotherInstaller@email.invalid"
        });
        const project = await insertOne("project", {
          company_id: company.id
        });
        await insertOne("project_member", {
          project_id: project.id,
          account_id: otherInstallerAccount.id
        });

        try {
          await actAs(client, account);
          const { rows: deletedRows } = await client.query(
            "delete from project_member where account_id = $1 returning id",
            [otherInstallerAccount.id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
    });
  });
});
