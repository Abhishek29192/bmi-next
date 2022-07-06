import {
  getDbPool,
  actAs,
  PERMISSION_DENIED,
  RLS_ERROR,
  initDb
} from "../test-utils/db";

let pool;
let client;

describe("Note", () => {
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
    describe("Market Admin", () => {
      it("should be able to add a note", async () => {
        const { marketAdmin, project, dbInsertOne } = await initDb(
          pool,
          client
        );
        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: marketAdmin.id,
          project_id: project.id
        };

        await actAs(client, marketAdmin);

        const note = await dbInsertOne("note", insertNote);

        expect(note).toEqual(expect.objectContaining(insertNote));
      });
    });

    describe("Company Admin", () => {
      it("should be able to add a note of his company", async () => {
        const { companyAdmin, project, dbInsertOne } = await initDb(
          pool,
          client
        );
        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: companyAdmin.id,
          project_id: project.id
        };

        await actAs(client, companyAdmin);

        const note = await dbInsertOne("note", insertNote);

        expect(note).toEqual(expect.objectContaining(insertNote));
      });

      it("shouldn't be able to add a note of another company", async () => {
        const { companyAdmin, otherProject, dbInsertOne } = await initDb(
          pool,
          client
        );
        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: companyAdmin.id,
          project_id: otherProject.id
        };
        try {
          await actAs(client, companyAdmin);

          const note = await dbInsertOne("note", insertNote);

          expect(note).toBeNull();
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("note"));
        }
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to add a note", async () => {
        const { account, project, dbInsertOne } = await initDb(
          pool,
          client,
          "INSTALLER"
        );
        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: account.id,
          project_id: project.id
        };

        try {
          await actAs(client, account);

          const note = await dbInsertOne("note", insertNote);

          expect(note).toBeNull();
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });

    describe("Auditor", () => {
      it("should be able to see any notes within the market", async () => {
        const { auditor, market } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query("SELECT * FROM note");
        const { rows: marketNotes } = await client.query(
          "SELECT * FROM note JOIN project p ON project_id = p.id JOIN company c ON p.company_id = c.id WHERE c.market_id = $1",
          [market.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(marketNotes.length).toBe(rows.length);
      });

      it("shouldn't be able to see any notes from other market", async () => {
        const { auditor, otherMarket } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query("SELECT * FROM note");
        const { rows: marketNotes } = await client.query(
          "SELECT * FROM note JOIN project p ON project_id = p.id JOIN company c ON p.company_id = c.id WHERE c.market_id = $1",
          [otherMarket.id]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(marketNotes.length).toBe(0);
      });

      it("shouldn't be able to update a note", async () => {
        const { auditor, note } = await initDb(pool, client);
        try {
          await actAs(client, auditor);

          const updatedNote = await client.query(
            "UPDATE note SET body = 'test' WHERE id = $1",
            [note.id]
          );

          expect(updatedNote).toBeFalsy();
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });

      it("shouldn't be able to add a note", async () => {
        const { auditor, project, dbInsertOne } = await initDb(pool, client);

        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: auditor.id,
          project_id: project.id
        };
        try {
          await actAs(client, auditor);

          const note = await dbInsertOne("note", insertNote);

          expect(note).toBeNull();
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });

      it("shouldn't be able to delete a note", async () => {
        const {
          auditor,
          account,
          superAdmin,
          project,
          dbDeleteRow,
          dbInsertOne
        } = await initDb(pool, client);

        const insertNote = {
          body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
          author_id: account.id,
          project_id: project.id
        };
        try {
          await actAs(client, superAdmin);
          await dbInsertOne("note", insertNote);
          await actAs(client, auditor);

          const note = await dbDeleteRow("note", {
            author_id: account.id
          });

          expect(note).toBeFalsy();
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });
  });
});
