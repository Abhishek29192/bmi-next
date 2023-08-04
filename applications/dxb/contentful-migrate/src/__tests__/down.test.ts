import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import type { migrateDown } from "@bmi-digital/contentful-migration";

jest.unstable_mockModule("dotenv/config", () => ({ config: jest.fn() }));

const mockMigrateDown = jest.fn<typeof migrateDown>();
jest.unstable_mockModule("@bmi-digital/contentful-migration", () => ({
  migrateDown: (
    script: string,
    projectPath: string,
    spaceId: string,
    contentfulEnvironment: string,
    managementAccessToken: string
  ) =>
    mockMigrateDown(
      script,
      projectPath,
      spaceId,
      contentfulEnvironment,
      managementAccessToken
    )
}));

const main = async (script?: string) =>
  (await import("../down.js")).main(script);

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
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
  });

  it("should return if migrateDown returns successfully", async () => {
    await main("some-script.js");

    expect(mockMigrateDown).toHaveBeenCalledWith(
      "some-script.js",
      path.dirname(path.dirname(fileURLToPath(import.meta.url))),
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
  });
});
