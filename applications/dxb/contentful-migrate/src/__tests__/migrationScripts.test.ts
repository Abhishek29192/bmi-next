import path from "path";
import { runMigrationScripts } from "../migrationScripts";

const mockMigrateUp = jest.fn();
jest.mock("@bmi-digital/contentful-migration", () => ({
  migrateUp: (...args: unknown[]) => mockMigrateUp(...args)
}));

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
      path.dirname(__dirname),
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
      path.dirname(__dirname),
      "spaceId",
      "contentfulAlias",
      "managementAccessToken",
      false
    );
  });
});
