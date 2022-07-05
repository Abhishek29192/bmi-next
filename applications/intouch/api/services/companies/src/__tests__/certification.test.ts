import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("Certification", () => {
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

  describe("Auditor", () => {
    it("should see all certification for the market", async () => {
      const { auditor, otherMarketCertification } = await initDb(pool, client);

      await actAs(client, auditor);
      const { rows } = await client.query(`SELECT * FROM certification`);
      const { rows: otherMarketCerts } = await client.query(
        `SELECT * FROM certification WHERE id = $1`,
        [otherMarketCertification.id]
      );

      expect(rows.length).toBeGreaterThan(0);
      expect(otherMarketCerts.length).toBe(0);
    });

    it("shouldn't able to update certificate", async () => {
      const { auditor, certification } = await initDb(pool, client);

      await actAs(client, auditor);
      try {
        const { rows } = await client.query(
          `UPDATE certification SET docebo_user_id = 2 WHERE id = $1`,
          [certification.id]
        );
        expect(rows.length).toBe(0);
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("certification"));
      }
    });

    it("shouldn't able to delete certificate", async () => {
      const { auditor, certification, dbDeleteRow } = await initDb(
        pool,
        client
      );

      await actAs(client, auditor);
      try {
        const result = await dbDeleteRow("certification", {
          id: certification.id
        });
        expect(result).toBeNull();
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("certification"));
      }
    });
  });
});
