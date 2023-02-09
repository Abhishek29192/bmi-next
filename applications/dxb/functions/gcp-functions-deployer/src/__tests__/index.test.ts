/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs";
import path from "path";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";

jest.mock("@bmi-digital/functions-logger");

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const resourcesBasePath = `${path.resolve(__dirname)}/resources`;
const apiSecret = "api_secret";
const trigger_secret = "trigger_secret";

const downloadFile = jest.fn();
const fileExists = jest.fn();

const file = jest.fn().mockImplementation(() => ({
  name: "file1.json",
  download: downloadFile,
  exists: fileExists
}));

const bucket = jest.fn().mockImplementation(() => ({
  file: () => file()
}));

jest.mock("@google-cloud/storage/build/src/storage", () => {
  const mStorage = jest.fn(() => ({
    bucket: (bucketName: string) => bucket(bucketName)
  }));
  return { Storage: mStorage };
});

const function2Metadata = JSON.parse(
  fs.readFileSync(
    `${resourcesBasePath}/market1_function2_metadata.json`,
    "utf8"
  )
);
const function3Metadata = JSON.parse(
  fs.readFileSync(
    `${resourcesBasePath}/market1_function3_metadata.json`,
    "utf8"
  )
);

const filterFunctionMetadata = jest
  .fn()
  .mockReturnValue([function2Metadata, function3Metadata]);
jest.doMock("../filter", () => ({
  filterFunctionMetadata: filterFunctionMetadata
}));

const deploy = async (file: any) => (await import("../index")).deploy(file);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("When GCP_STORAGE_NAME is not provided", () => {
  const validFile = "sources/gcp-download-zip.zip";
  it("throws an error", async () => {
    const gcpStorageName = process.env.GCP_STORAGE_NAME;
    delete process.env.GCP_STORAGE_NAME;

    try {
      await deploy({ name: validFile });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Unable to connect to a storage bucket"
      );
    }

    expect(file).toBeCalledTimes(0);
    expect(fileExists).toBeCalledTimes(0);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    process.env.GCP_STORAGE_NAME = gcpStorageName;
  });
});

describe("When TRIGGER_CB_SECRET is not provided", () => {
  const validFile = "sources/gcp-download-zip.zip";
  it("throws an error", async () => {
    const triggerApiSecret = process.env.TRIGGER_CB_SECRET;
    delete process.env.TRIGGER_CB_SECRET;

    try {
      await deploy({ name: validFile });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "TRIGGER_CB_SECRET has not been set"
      );
    }

    expect(file).toBeCalledTimes(0);
    expect(fileExists).toBeCalledTimes(0);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    process.env.TRIGGER_CB_SECRET = triggerApiSecret;
  });
});

describe("When TRIGGER_API_KEY is not provided", () => {
  const validFile = "sources/gcp-download-zip.zip";
  it("throws an error", async () => {
    const triggerApiKeySecret = process.env.TRIGGER_API_KEY;
    delete process.env.TRIGGER_API_KEY;

    try {
      await deploy({ name: validFile });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "TRIGGER_API_KEY has not been set"
      );
    }

    expect(file).toBeCalledTimes(0);
    expect(fileExists).toBeCalledTimes(0);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    process.env.TRIGGER_API_KEY = triggerApiKeySecret;
  });
});

describe("When function is called for an invalid file", () => {
  const invalidFile = "random/invalid.txt";

  it("Does not try to get metadata file", async () => {
    await deploy({ name: invalidFile });

    expect(file).toBeCalledTimes(0);
    expect(fileExists).toBeCalledTimes(0);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
  });
});

describe("When function is called with a valid file", () => {
  const validFile = "sources/gcp-download-zip.zip";
  it("Does nothing if the file cannot be found", async () => {
    fileExists.mockResolvedValue(false);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if the file cannot be downloaded", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue(null);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if getSecret throws error for trigger secret", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if getSecret throws error for trigger API key secret", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if cloud build webhook call returns non-ok response", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" },
      status: 404
    });

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function2Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function3Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
  });
  it("Deploys function", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" }
    });

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function2Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://${process.env.LOCATION}cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function3Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
  });
});
