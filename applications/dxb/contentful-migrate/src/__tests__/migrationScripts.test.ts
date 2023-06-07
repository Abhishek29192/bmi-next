import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import type { migrateUp } from "@bmi-digital/contentful-migration";

const mockMigrateUp = jest.fn<typeof migrateUp>();
jest.mock("@bmi-digital/contentful-migration", () => ({
  migrateUp: (
    projectPath: string,
    spaceId: string,
    contentfulEnvironment: string,
    managementAccessToken: string,
    dryRun?: boolean
  ) =>
    mockMigrateUp(
      projectPath,
      spaceId,
      contentfulEnvironment,
      managementAccessToken,
      dryRun
    )
}));

const runMigrationScripts = async (
  spaceId: string,
  contentfulAlias: string,
  managementAccessToken: string,
  isDryRun: boolean
) =>
  (await import("../migrationScripts.js")).runMigrationScripts(
    spaceId,
    contentfulAlias,
    managementAccessToken,
    isDryRun
  );

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("runMigrationScripts", () => {
  it("should return if migrateUp returns a status of 0", async () => {
    mockMigrateUp.mockResolvedValueOnce(0);

    await runMigrationScripts(
      "spaceId",
      "contentfulAlias",
      "managementAccessToken",
      false
    );

    expect(mockMigrateUp).toHaveBeenCalledWith(
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      "spaceId",
      "contentfulAlias",
      "managementAccessToken",
      false
    );
  });

  it("should throw error when migrateUp does not return a status of 0", async () => {
    mockMigrateUp.mockResolvedValueOnce(1);

    try {
      await runMigrationScripts(
        "spaceId",
        "contentfulAlias",
        "managementAccessToken",
        false
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Migration failed on contentful environment contentfulAlias, please check the error log above."
      );
    }

    expect(mockMigrateUp).toHaveBeenCalledWith(
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      "spaceId",
      "contentfulAlias",
      "managementAccessToken",
      false
    );
  });
});
