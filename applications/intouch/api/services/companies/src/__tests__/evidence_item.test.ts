import { getDbPool, actAs, PERMISSION_DENIED, initDb } from "../test-utils/db";

let pool;
let client;

describe("evidence_item", () => {
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
    it("should see all evidence_item for the market", async () => {
      const {
        auditor,
        companyAdmin,
        project,
        dbInsertOne,
        otherMarketProject
      } = await initDb(pool, client, "SUPER_ADMIN");
      const guarantee = await dbInsertOne("guarantee", {
        requestor_account_id: companyAdmin.id,
        project_id: project.id,
        guarantee_reference_code: "PITCHED_PRODUCT"
      });
      await dbInsertOne("evidence_item", {
        evidence_category_type: "CUSTOM",
        guarantee_id: guarantee.id,
        project_id: project.id,
        name: "test.png",
        attachment: "attachment1"
      });
      const otherMarketEvidenceItem = await dbInsertOne("evidence_item", {
        evidence_category_type: "CUSTOM",
        guarantee_id: guarantee.id,
        project_id: otherMarketProject.id,
        name: "test.png",
        attachment: "attachment"
      });

      await actAs(client, auditor);

      const { rows } = await client.query("SELECT * FROM evidence_item");
      const { rows: otherMarketEvidenceItems } = await client.query(
        "SELECT * FROM evidence_item WHERE id = $1",
        [otherMarketEvidenceItem.id]
      );

      expect(rows.length).toBeGreaterThan(0);
      expect(otherMarketEvidenceItems.length).toBe(0);
    });

    it("shouldn't able to update evidence_item", async () => {
      const { auditor, companyAdmin, project, dbInsertOne } = await initDb(
        pool,
        client,
        "SUPER_ADMIN"
      );
      const guarantee = await dbInsertOne("guarantee", {
        requestor_account_id: companyAdmin.id,
        project_id: project.id,
        guarantee_reference_code: "PITCHED_PRODUCT"
      });
      const item = await dbInsertOne("evidence_item", {
        evidence_category_type: "CUSTOM",
        guarantee_id: guarantee.id,
        project_id: project.id,
        name: "test.png",
        attachment: "attachment"
      });

      await actAs(client, auditor);

      try {
        const { rows: evidenceItems } = await client.query(
          "UPDATE evidence_item SET project_id = 2 WHERE id = $1",
          [item.id]
        );

        expect(evidenceItems.length).toBe(0);
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("evidence_item"));
      }
    });

    it("shouldn't able to delete evidence_item", async () => {
      const { auditor, companyAdmin, project, dbInsertOne, dbDeleteRow } =
        await initDb(pool, client, "SUPER_ADMIN");
      const guarantee = await dbInsertOne("guarantee", {
        requestor_account_id: companyAdmin.id,
        project_id: project.id,
        guarantee_reference_code: "PITCHED_PRODUCT"
      });
      const item = await dbInsertOne("evidence_item", {
        evidence_category_type: "CUSTOM",
        guarantee_id: guarantee.id,
        project_id: project.id,
        name: "test.png",
        attachment: "attachment"
      });

      await actAs(client, auditor);

      await actAs(client, auditor);
      try {
        const result = await dbDeleteRow("evidence_item", {
          id: item.id
        });
        expect(result).toBeNull();
      } catch (error) {
        expect(error.message).toBe(PERMISSION_DENIED("evidence_item"));
      }
    });
  });
});
