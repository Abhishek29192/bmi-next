import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import { migrateCreate } from "@bmi-digital/contentful-migration";

jest.unstable_mockModule("dotenv/config", () => ({ config: jest.fn() }));

const mockMigrateCreate = jest.fn<typeof migrateCreate>();
jest.unstable_mockModule("@bmi-digital/contentful-migration", () => ({
  migrateCreate: (script: string, projectPath: string) =>
    mockMigrateCreate(script, projectPath)
}));

const main = async (script?: string) =>
  (await import("../create.js")).main(script);

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
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "..",
        "..",
        "..",
        "src"
      )
    );
  });

  it("should return if migrateCreate returns successfully", async () => {
    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "..",
        "..",
        "..",
        "src"
      )
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is not set", async () => {
    delete process.env.MIGRATION_DRY_RUN;

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "..",
        "..",
        "..",
        "src"
      )
    );
  });

  it("should pass dry run as false if MIGRATION_DRY_RUN is set to false", async () => {
    process.env.MIGRATION_DRY_RUN = "false";

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "..",
        "..",
        "..",
        "src"
      )
    );
  });

  it("should pass dry run as true if MIGRATION_DRY_RUN is set to true", async () => {
    process.env.MIGRATION_DRY_RUN = "true";

    await main("some-script.js");

    expect(mockMigrateCreate).toHaveBeenCalledWith(
      "some-script.js",
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "..",
        "..",
        "..",
        "src"
      )
    );
  });
});
