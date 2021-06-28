/* eslint-disable security/detect-non-literal-fs-filename */
import path from "path";
import fs from "fs";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import { when } from "jest-when";
// Needed until we upgrade to yarn 2 or use an NPM registry - https://github.com/yarnpkg/yarn/issues/6323
import { mockResponses } from "../../../../libraries/fetch-mocks/src/index";

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

let deploy;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  const index = require("../index");
  deploy = index.deploy;
});

describe("When function is called for an invalid file", () => {
  const invalidFile = "random/invalid.txt";

  it("Does not try to get metadata file", async () => {
    await deploy({ name: invalidFile }, {});

    expect(file).toBeCalledTimes(0);
  });
});

describe("When function is called with a valid file", () => {
  const validFile = "sources/gcp-download-zip.zip";
  it("Does nothing if the file cannot be found", async () => {
    fileExists.mockResolvedValue(false);

    await deploy({ name: validFile }, {});

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(0);
    expect(filterFunctionMetadata).toBeCalledTimes(0);
  });

  it("Does nothing if the file cannot be downloaded", async () => {
    fileExists.mockResolvedValue(true);
    downloadFile.mockResolvedValue([Buffer.of()]);
    filterFunctionMetadata.mockReturnValue(null);

    await deploy({ name: validFile }, {});

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
    expect(filterFunctionMetadata).toBeCalledTimes(1);
  });

  it("Downloads all meta files", async () => {
    fileExists.mockResolvedValue(true);

    await deploy({ name: validFile }, {});

    expect(file).toBeCalledTimes(1);
    expect(fileExists).toBeCalledTimes(1);
    expect(downloadFile).toBeCalledTimes(1);
  });

  it("Calls secret manager to fetch secrets", async () => {
    fileExists.mockResolvedValue(true);
    downloadFile.mockResolvedValue([Buffer.of()]);
    filterFunctionMetadata.mockReturnValue([
      function2Metadata,
      function3Metadata
    ]);

    await deploy({ name: validFile }, {});

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
  });

  it("Calls Cloud-Build webhook which returns non-200 status", async () => {
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" },
      status: 404
    });

    await deploy({ name: validFile }, {});

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

  it("Calls Cloud-Build webhook", async () => {
    const triggerName = "gcp-download-zip-trigger";

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      body: "{}",
      headers: { "Content-Type": "application/json" }
    });

    await deploy({ name: validFile }, {});

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
