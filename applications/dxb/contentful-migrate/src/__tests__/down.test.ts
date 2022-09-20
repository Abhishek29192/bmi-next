import path from "path";

jest.mock("dotenv/config", () => ({ config: jest.fn() }), { virtual: true });

const mockMigrateDown = jest.fn();
jest.mock("@bmi-digital/contentful-migration", () => ({
  migrateDown: (...any: unknown[]) => mockMigrateDown(...any)
}));

const main = async (script?: string) => (await import("../down")).main(script);

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
      await main("some-script.js");
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
      await main("some-script.js");
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
      await main("some-script.js");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
      );
    }
  });

  it("should throw error if scripts aren't passed in", async () => {
    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Missing script to rollback to");
    }
  });

  it("should throw error if migrateDown throws an error", async () => {
    mockMigrateDown.mockRejectedValueOnce(new Error("Expected error"));

    try {
      await main("some-script.js");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.dirname(__dirname),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should return if migrateDown returns successfully", async () => {
    await main("some-script.js");

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.dirname(__dirname),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is not set", async () => {
    delete process.env.MIGRATION_DRY_RUN;

    await main("some-script.js");

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.dirname(__dirname),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is set to false", async () => {
    process.env.MIGRATION_DRY_RUN = "false";

    await main("some-script.js");

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.dirname(__dirname),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      false
    );
  });

  it("should pass dry run as true if MIGRATION_DRY_RUN is set to true", async () => {
    process.env.MIGRATION_DRY_RUN = "true";

    await main("some-script.js");

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.dirname(__dirname),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN,
      true
    );
  });
});
