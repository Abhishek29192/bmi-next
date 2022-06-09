import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Project", () => {
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
    describe("Company admin", () => {
      it("should be able to add a project", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        await actAs(client, account);

        const project = dbInsertOne("project", {
          company_id: company.id
        });

        expect(project).toBeTruthy();
      });

      it("should not be able to see a hidden project", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );

        const project = await dbInsertOne("project", {
          company_id: company.id,
          hidden: true
        });
        await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: account.id
        });

        await actAs(client, account);

        const { rows: projects } = await client.query(
          `select * from project WHERE id = $1`,
          [project.id]
        );

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to add a project to another company", async () => {
        const { account, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        // TODO: setup separate company I guess to try to insert with that ID
        const otherMarket = await dbInsertOne("market", {
          domain: "OTHER_MARKET_DOMAIN",
          language: "en",
          projects_enabled: true
        });

        const otherCompany = await dbInsertOne("company", {
          market_id: otherMarket.id
        });

        try {
          await actAs(client, account);
          await dbInsertOne("project", {
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
          company,
          dbInsertOne
        } = await initDb(pool, client, "COMPANY_ADMIN");

        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        const installerAccount = await dbInsertOne("account", {
          role: "INSTALLER",
          market_id: market.id,
          // Specify email so it doesn't clash with account from setupDate
          email: "installer@email.invalid"
        });

        await actAs(client, companyAdminAccount);
        const projectMember = await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installerAccount.id
        });

        expect(projectMember).toBeTruthy();
      });
    });

    describe("Market Admin", () => {
      it("should not be able to see projects outside of own market", async () => {
        const { otherMarket, dbInsertOne } = await initDb(
          pool,
          client,
          "COMPANY_ADMIN"
        );
        // NOTE: Projects get market via company
        const company = await dbInsertOne("company", {
          market_id: otherMarket.id
        });
        await dbInsertOne("project", {
          company_id: company.id,
          technology: "PITCHED"
        });

        // Separate market, separate account
        const myMarket = await dbInsertOne("market", {
          domain: "MY_MARKET_DOMAIN",
          language: "en"
        });
        const myCompany = await dbInsertOne("company", {
          market_id: myMarket.id
        });
        await dbInsertOne("project", {
          name: "My Project",
          company_id: myCompany.id,
          technology: "PITCHED"
        });
        // NOTE: account is not related to company,
        // market adming sees all projects in own market
        const account = await dbInsertOne("account", {
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
        const { account } = await initDb(pool, client, "INSTALLER");

        await actAs(client, account);
        const { rows: projects } = await client.query(
          "select * from project where company_id != (select * from current_company())"
        );

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to see hidden project", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );

        // Setup, without authorization
        const createdProject = await dbInsertOne("project", {
          company_id: company.id,
          hidden: true
        });
        await dbInsertOne("project_member", {
          project_id: createdProject.id,
          account_id: account.id
        });

        await actAs(client, account);
        const { rows: projects } = await client.query("select * from project");

        expect(projects.length).toEqual(0);
      });

      it("shouldn't be able to add an installer to the project", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );

        const project = await dbInsertOne("project", {
          company_id: company.id
        });

        try {
          await dbInsertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });

      it("should be able to remove themselves from a project", async () => {
        const { account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );

        // Setup, without authorization
        const project = await dbInsertOne("project", {
          company_id: company.id
        });
        await dbInsertOne("project_member", {
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
        const { market, account, company, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );

        // Setup, without authorization
        const otherInstallerAccount = await dbInsertOne("account", {
          role: "INSTALLER",
          market_id: market.id,
          email: "anotherInstaller@email.invalid"
        });
        const project = await dbInsertOne("project", {
          company_id: company.id
        });
        await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: otherInstallerAccount.id
        });

        try {
          await actAs(client, account);
          await client.query(
            "delete from project_member where account_id = $1 returning id",
            [otherInstallerAccount.id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
    });
  });

  describe("Auditor", () => {
    it("should be able to see all projects", async () => {
      const { auditor } = await initDb(pool, client);

      await actAs(client, auditor);

      const { rows: projects } = await client.query("SELECT * FROM project");

      expect(projects.length).toBeGreaterThan(0);
    });

    it("should not be able to see projects outside of own market", async () => {
      const { auditor, otherMarket, dbInsertOne } = await initDb(
        pool,
        client,
        "SUPER_ADMIN"
      );
      const company = await dbInsertOne("company", {
        market_id: otherMarket.id
      });
      const project = await dbInsertOne("project", {
        company_id: company.id,
        technology: "PITCHED"
      });

      await actAs(client, auditor);

      const { rows: visibleProjects } = await client.query(
        "SELECT * FROM project WHERE id = $1",
        [project.id]
      );

      expect(visibleProjects.length).toEqual(0);
    });

    it("shouldn't be able to update any projects", async () => {
      const updatedName = "Updated Name";
      try {
        const { auditor, product } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows: projects } = await client.query(
          "UPDATE project SET name = $2 WHERE id = $1",
          [product.id, updatedName]
        );

        expect(projects.length).toBe(0);
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("project"));
      }
    });

    it("shouldn't be able to delete any projects", async () => {
      try {
        const { auditor, project, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows: projects } = await dbDeleteRow("project", {
          id: project.id
        });

        expect(projects.length).toBe(0);
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("project"));
      }
    });
  });
});
