import { getDbPool, actAs, initDb, PERMISSION_DENIED } from "../test-utils/db";

let pool;
let client;

describe("Company Address", () => {
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

  describe("Installer", () => {
    it("should be able to see addresses if in the company", async () => {
      const { address, installer } = await initDb(pool, client);
      await actAs(client, installer);

      const { rows } = await client.query(
        "SELECT * FROM address WHERE id = $1",
        [address.id]
      );
      expect(rows).toHaveLength(1);
    });
  });

  describe("Auditor", () => {
    it("should be able to see addresses if not in the company", async () => {
      const { address, auditor } = await initDb(pool, client);
      await actAs(client, auditor);

      const { rows } = await client.query(
        "SELECT * FROM address WHERE id = $1",
        [address.id]
      );
      expect(rows).toHaveLength(1);
    });

    it("shouldn't be able to add an address", async () => {
      try {
        const { auditor, dbInsertOne } = await initDb(pool, client);

        await actAs(client, auditor);

        const address = await dbInsertOne("address", {
          first_line: "First Line",
          postcode: "postcode"
        });

        expect(address).toBeNull();
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("address"));
      }
    });

    it("shouldn't be able to update an address", async () => {
      try {
        const { auditor } = await initDb(pool, client);

        await actAs(client, auditor);

        const { rows } = await client.query(
          "update address set first_line=$1 WHERE id = $2 RETURNING *",
          ["updated_first_line", 1]
        );

        expect(rows).toBeNull();
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("address"));
      }
    });

    it("shouldn't be able to delete an address", async () => {
      try {
        const { auditor, dbDeleteRow } = await initDb(pool, client);

        await actAs(client, auditor);

        const query = await dbDeleteRow("address", { id: 1 });

        expect(query).toBeFalsy();
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("address"));
      }
    });
  });

  describe("Company Admin", () => {
    it("should be able to add an address", async () => {
      const { companyAdmin, dbInsertOne } = await initDb(pool, client);

      await actAs(client, companyAdmin);

      const address = await dbInsertOne("address", {
        first_line: "First Line",
        postcode: "postcode"
      });

      expect(address).not.toBeNull();
    });
  });
});
