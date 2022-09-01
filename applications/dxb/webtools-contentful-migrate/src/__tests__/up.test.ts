import { migrateUp } from "@bmi-digital/contentful-migration";

describe("test", () => {
  it("testing", async () => {
    try {
      migrateUp(
        "../migrations",
        "space-id",
        "contentful-environment",
        "management-access-token"
      );
    } catch (error) {
      expect(error).toBe("");
    }
  });
});
