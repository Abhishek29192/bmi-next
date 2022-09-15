export {};

jest.mock("dotenv/config", () => ({ config: jest.fn() }), { virtual: true });

const mockRunMigrationScripts = jest.fn();
jest.mock("../migrationScripts", () => ({
  runMigrationScripts: (...any: unknown[]) => mockRunMigrationScripts(...any)
}));

const main = async () => (await import("../up")).main();

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.SPACE_ID = "spaceId";
  process.env.CONTENTFUL_ENVIRONMENT = "contentfulEnvironment";
  process.env.MANAGEMENT_ACCESS_TOKEN = "managementAccessToken";
});

describe("main", () => {
  it("should throw error if SPACE_ID environment variable is not set", async () => {
    delete process.env.SPACE_ID;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
      );
    }
  });

  it("should throw error if CONTENTFUL_ENVIRONMENT environment variable is not set", async () => {
    delete process.env.CONTENTFUL_ENVIRONMENT;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
      );
    }
  });

  it("should throw error if MANAGEMENT_ACCESS_TOKEN environment variable is not set", async () => {
    delete process.env.MANAGEMENT_ACCESS_TOKEN;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
      );
    }
  });

  it("should throw error if runMigrationsScripts throws an error", async () => {
    mockRunMigrationScripts.mockRejectedValueOnce(new Error("Expected error"));

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should return if runMigrationsScripts returns successfully", async () => {
    await main();

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is not set", async () => {
    delete process.env.MIGRATION_DRY_RUN;

    await main();

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is set to false", async () => {
    process.env.MIGRATION_DRY_RUN = "false";

    await main();

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as true if MIGRATION_DRY_RUN is set to true", async () => {
    process.env.MIGRATION_DRY_RUN = "true";

    await main();

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      true
    );
  });

  it("should not run if it's called from the CLI", async () => {
    await import("../up");
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
  });
});
