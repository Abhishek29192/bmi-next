import { Role } from "@bmi/intouch-api-types";
import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool: any;
let insertOne;
let client;
let context;

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

  const project = await insertOne("project", {
    company_id: company.id
  });

  const projectMember = await insertOne("project_member", {
    project_id: project.id,
    account_id: account.id
  });

  return {
    market,
    company,
    account,
    project,
    projectMember
  };
};

describe("Project Member", () => {
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

  describe("Db Permission", () => {
    describe("Installer", () => {
      const role: Role = "INSTALLER";
      it("shouldn't be able to create a project member", async () => {
        const { account, project } = await setupData(role);
        await actAs(client, account);

        try {
          await insertOne("project_member", {
            project_id: project.id,
            account_id: account.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });
      it("shouldn't be able to update a project member responsible installer", async () => {
        const { account, projectMember } = await setupData(role);
        await actAs(client, account);

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
      const role: Role = "COMPANY_ADMIN";
      it("should be able to create a project member", async () => {
        const { account, project } = await setupData(role);
        await actAs(client, account);

        const projectMember = await insertOne("project_member", {
          project_id: project.id,
          account_id: account.id
        });
        expect(projectMember).toBeTruthy();
      });
      it("should be able to update a project member responsible installer", async () => {
        const { account, projectMember } = await setupData(role);
        await actAs(client, account);

        const updatedProjectMember = await client.query(
          "update project_member set is_responsible_installer = false where id = $1 returning id",
          [projectMember.id]
        );
        expect(updatedProjectMember).toBeTruthy();
      });
    });
  });
});
