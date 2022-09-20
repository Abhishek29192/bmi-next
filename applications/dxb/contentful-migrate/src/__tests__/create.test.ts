import path from "path";

jest.mock("dotenv/config", () => ({ config: jest.fn() }), { virtual: true });

const mockMigrateCreate = jest.fn();
jest.mock("@bmi-digital/contentful-migration", () => ({
  migrateCreate: (...any: unknown[]) => mockMigrateCreate(...any)
}));

const main = async (script?: string) =>
  (await import("../create")).main(script);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("main", () => {
  it("should throw error if script isn't passed in", async () => {
    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Missing script name to create");
    }
  });

  it("should throw error if migrateCreate throws an error", async () => {
    mockMigrateCreate.mockRejectedValueOnce(new Error("Expected error"));

    try {
      await main("some-script.js");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.join(__dirname, ".."),
      false
    );
  });

  it("should return if migrateCreate returns successfully", async () => {
    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.join(__dirname, ".."),
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is not set", async () => {
    delete process.env.MIGRATION_DRY_RUN;

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.join(__dirname, ".."),
      false
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is set to false", async () => {
    process.env.MIGRATION_DRY_RUN = "false";

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.join(__dirname, ".."),
      false
    );
  });

  it("should pass dry run as true if MIGRATION_DRY_RUN is set to true", async () => {
    process.env.MIGRATION_DRY_RUN = "true";

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      "scripts",
      path.join(__dirname, ".."),
      true
    );
  });
});
