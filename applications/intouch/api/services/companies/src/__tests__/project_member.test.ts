import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Project Member", () => {
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

  describe("Db Permission", () => {
    describe("Installer", () => {
      it("shouldn't be able to create a project member", async () => {
        const { account, project, dbInsertOne } = await initDb(pool, client);
        await actAs(client, account);

        try {
          await dbInsertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
      it("shouldn't be able to update a project member responsible installer", async () => {
        const { installer, project, dbInsertOne } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        const projectMember = await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installer.id
        });
        await actAs(client, installer);

        try {
          await client.query(
            "update project_member set is_responsible_installer = false where id = $1 returning id",
            [projectMember.id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
    });

    describe("Company Admin", () => {
      it("should be able to create a project member", async () => {
        const { companyAdmin, installer, project, dbInsertOne } = await initDb(
          pool,
          client
        );
        await actAs(client, companyAdmin);

        const projectMember = await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installer.id
        });
        expect(projectMember).toBeTruthy();
      });
      it("should be able to update a project member responsible installer", async () => {
        const { companyAdmin, project, dbInsertOne, installer } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        const projectMember = await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installer.id
        });
        await actAs(client, companyAdmin);

        const updatedProjectMember = await client.query(
          "update project_member set is_responsible_installer = false where id = $1 returning id",
          [projectMember.id]
        );
        expect(updatedProjectMember).toBeTruthy();
      });
    });

    describe("Auditor", () => {
      it("should be able to see project members from the market", async () => {
        const {
          auditor,
          installer,
          project,
          dbInsertOne,
          otherMarketAccount,
          otherMarketProject
        } = await initDb(pool, client, "SUPER_ADMIN");
        await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installer.id
        });
        const otherMarketProjectMember = await dbInsertOne("project_member", {
          project_id: otherMarketProject.id,
          account_id: otherMarketAccount.id
        });
        await actAs(client, auditor);

        const { rows } = await client.query("SELECT * FROM project_member");
        const { rows: otherMarketAccounts } = await client.query(
          "SELECT * FROM project_member WHERE id = $1",
          [otherMarketProjectMember.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(otherMarketAccounts.length).toBe(0);
      });

      it("shouldn't be able to update a project member responsible installer", async () => {
        const { auditor, installer, project, dbInsertOne } = await initDb(
          pool,
          client,
          "SUPER_ADMIN"
        );
        const projectMember = await dbInsertOne("project_member", {
          project_id: project.id,
          account_id: installer.id
        });
        await actAs(client, auditor);

        try {
          const { rows } = await client.query(
            "update project_member set is_responsible_installer = false where id = $1 returning id",
            [projectMember.id]
          );

          expect(rows.length).toBe(0);
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
    });
  });
});
