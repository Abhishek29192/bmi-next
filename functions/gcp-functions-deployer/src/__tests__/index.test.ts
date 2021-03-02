import path from "path";
import fs from "fs";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";
import fetchMock from "jest-fetch-mock";
import { when } from "jest-when";

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

const downloadFile = jest.fn().mockImplementation(() => Promise.resolve());

const mMetaFile1 = {
  name: "file1.json",
  download: downloadFile
};

const file = jest.fn().mockImplementation(() => {
  return mMetaFile1;
});

const bucket = jest.fn().mockImplementation(() => ({
  file: () => file()
}));

jest.mock("@google-cloud/storage/build/src/storage", () => {
  const mStorage = jest.fn(() => ({
    bucket: (bucketName: string) => bucket(bucketName)
  }));
  return { Storage: mStorage };
});

const function1Metadata = JSON.parse(
  fs.readFileSync(
    `${resourcesBasePath}/market1_function1_metadata.json`,
    "utf8"
  )
);
const filterFunctionMetadata = jest.fn().mockResolvedValue(function1Metadata);
jest.mock("../filter", () => ({
  filterFunctionMetadata: filterFunctionMetadata
}));

let deploy;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.resetMocks();
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
  it("Fetch the meta file", async () => {
    await deploy({ name: validFile }, {});

    expect(file).toBeCalledTimes(1);
  });

  it("Downloads all meta files", async () => {
    await deploy({ name: validFile }, {});

    expect(downloadFile).toBeCalledTimes(1);
  });

  it("Calls secret manager to fetch secrets", async () => {
    await deploy({ name: validFile }, {});

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.TRIGGER_API_KEY_SECRET}/versions/latest`
    });
  });

  it("Calls Cloud-Build webhook", async () => {
    const triggerName = "gcp-download-zip-trigger";

    await deploy({ name: validFile }, {});

    expect(fetchMock).toBeCalledWith(
      `https://cloudbuild.googleapis.com/v1/projects/${process.env.GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiSecret}&secret=${trigger_secret}`,
      {
        method: "POST",
        body: JSON.stringify(function1Metadata),
        headers: { "Content-Type": "application/json" }
      }
    );
  });
});
