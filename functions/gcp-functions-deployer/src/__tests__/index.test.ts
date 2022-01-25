/* eslint-disable security/detect-non-literal-fs-filename */
import path from "path";
import fs from "fs";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import { when } from "jest-when";
import { mockResponses } from "@bmi/fetch-mocks";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const resourcesBasePath = `${path.resolve(__dirname)}/resources`;
const apiSecret = "api_secret";
const trigger_secret = "trigger_secret";

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

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

const deploy = (file: any) => require("../index").deploy(file);

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
      expect(error.message).toEqual("Unable to connect to a storage bucket");
    }

    expect(file).toBeCalledTimes(0);
    expect(fileExists).toBeCalledTimes(0);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    process.env.GCP_STORAGE_NAME = gcpStorageName;
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
    expect(accessSecretVersion).toBeCalledTimes(0);
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
    expect(accessSecretVersion).toBeCalledTimes(0);
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
    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if trigger secret returned with undefined payload from secret manager", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{}]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if trigger secret returned with undefined data from secret manager", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: {} }]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if trigger API key returned with undefined payload from secret manager", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: apiSecret } }]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
      })
      .mockReturnValue([{}]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it("Does nothing if trigger API key returned with undefined data from secret manager", async () => {
    fileExists.mockResolvedValue(true);
    const fileContents = [Buffer.of()];
    downloadFile.mockResolvedValue(fileContents);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: apiSecret } }]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: {} }]);

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
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
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: trigger_secret } }]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: apiSecret } }]);
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" },
      status: 404
    });

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function2Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
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
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: trigger_secret } }]);
    when(accessSecretVersion)
      .calledWith({
        name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
      })
      .mockReturnValue([{ payload: { data: apiSecret } }]);
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" }
    });

    await deploy({ name: validFile });

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledWith(fileContents, validFile);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function2Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
    expect(fetchMock).toHaveFetchedTimes(
      1,
      `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: function3Metadata,
        headers: { "Content-Type": "application/json" }
      }
    );
  });
});
