import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import type { migrateUp } from "@bmi-digital/contentful-migration";

const mockMigrateUp = jest.fn<typeof migrateUp>();
jest.unstable_mockModule("@bmi-digital/contentful-migration", () => ({
  migrateUp: (
    projectPath: string,
    spaceId: string,
    contentfulEnvironment: string,
    managementAccessToken: string
  ) =>
    mockMigrateUp(
      projectPath,
      spaceId,
      contentfulEnvironment,
      managementAccessToken
    )
}));

const runMigrationScripts = async (
  spaceId: string,
  contentfulAlias: string,
  managementAccessToken: string
) =>
  (await import("../migrationScripts.js")).runMigrationScripts(
    spaceId,
    contentfulAlias,
    managementAccessToken
  );

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("runMigrationScripts", () => {
  it("should return if migrateUp returns a status of 0", async () => {
    mockMigrateUp.mockResolvedValueOnce();

    await runMigrationScripts(
      "spaceId",
      "contentfulAlias",
      "managementAccessToken"
    );

    expect(mockMigrateUp).toHaveBeenCalledWith(
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      "spaceId",
      "contentfulAlias",
      "managementAccessToken"
    );
  });

  it("should throw error when migrateUp does not return a status of 0", async () => {
    mockMigrateUp.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(
      runMigrationScripts("spaceId", "contentfulAlias", "managementAccessToken")
    ).rejects.toThrowError("Expected Error");

    expect(mockMigrateUp).toHaveBeenCalledWith(
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      "spaceId",
      "contentfulAlias",
      "managementAccessToken"
    );
  });
});
