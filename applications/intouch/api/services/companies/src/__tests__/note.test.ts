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

  // Additional project membership. Seems to make sense to be a common setup for this model
  const project = await insertOne("project", {
    company_id: company.id
  });
  await insertOne("project_member", {
    project_id: project.id,
    account_id: account.id
  });

  return {
    market,
    company,
    account,
    project
  };
};

describe("Note", () => {
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
    describe("Market Admin", () => {
      it("should be able to add a note", async () => {
        const { account, project } = await setupData("MARKET_ADMIN");

        await actAs(client, account);

        const note = await insertOne("note", {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: account.id,
          project_id: project.id
        });

        expect(note).toBeTruthy();
      });
    });

    describe("Company Admin", () => {
      it("shouldn't be able to add a note", async () => {
        const { account, project } = await setupData("COMPANY_ADMIN");

        try {
          await actAs(client, account);

          await insertOne("note", {
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            author_id: account.id,
            project_id: project.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to add a note", async () => {
        const { account, project } = await setupData("INSTALLER");

        try {
          await actAs(client, account);

          await insertOne("note", {
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            author_id: account.id,
            project_id: project.id
          });
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });
  });
});
