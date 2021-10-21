import { Client } from "@elastic/elasticsearch";
import { protos } from "@google-cloud/secret-manager";

const mockClient = jest.fn();
jest.mock("@elastic/elasticsearch", () => {
  return {
    Client: function (...args: any[]) {
      return mockClient(...args);
    }
  };
});

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

beforeEach(() => {
  delete process.env.USE_LOCAL_ES;
  process.env.ES_CLOUD_ID = "es-cloud-id";
  process.env.ES_USERNAME = "es-username";

  jest.clearAllMocks();
  jest.resetModules();
});

const getEsClient = (): Promise<Client> =>
  require("../es-client").getEsClient();

describe("getEsClient with USE_LOCAL_ES as true", () => {
  it("should return a new client set from ES_CLOUD_ID", async () => {
    process.env.USE_LOCAL_ES = "true";
    process.env.ES_CLOUD_ID = "http://localhost:9200";
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    const esClient = await getEsClient();

    expect(esClient).toEqual(expectedClient);
    expect(mockClient).toBeCalledWith({ node: "http://localhost:9200" });
  });

  it("should only create a new client once if called multiple times", async () => {
    process.env.USE_LOCAL_ES = "true";
    process.env.ES_CLOUD_ID = "http://localhost:9200";
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    await getEsClient();
    await getEsClient();

    expect(mockClient).toBeCalledTimes(1);
    expect(mockClient).toBeCalledWith({ node: "http://localhost:9200" });
  });
});

describe("getEsClient without USE_LOCAL_ES", () => {
  it("should error if ES_CLOUD_ID is not set", async () => {
    delete process.env.ES_CLOUD_ID;

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("ES_CLOUD_ID was not provided");
    }

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should error if ES_USERNAME is not set", async () => {
    delete process.env.ES_USERNAME;

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("ES_USERNAME was not provided");
    }

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should error if secret could not be found", async () => {
    accessSecretVersion.mockResolvedValue([]);

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Unable to retrieve ES password");
    }

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should return a new client set from ES_CLOUD_ID and authentication", async () => {
    const esPassword = "es-password";
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    const esClient = await getEsClient();

    expect(esClient).toStrictEqual(expectedClient);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(mockClient).toBeCalledWith({
      cloud: {
        id: process.env.ES_CLOUD_ID
      },
      auth: {
        username: process.env.ES_USERNAME,
        password: esPassword
      },
      headers: {
        "content-type": "application/json"
      }
    });
  });

  it("should only create a new client once if called multiple times", async () => {
    const esPassword = "es-password";
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    await getEsClient();
    await getEsClient();

    expect(accessSecretVersion).toBeCalledTimes(1);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(mockClient).toBeCalledTimes(1);
    expect(mockClient).toBeCalledWith({
      cloud: {
        id: process.env.ES_CLOUD_ID
      },
      auth: {
        username: process.env.ES_USERNAME,
        password: esPassword
      },
      headers: {
        "content-type": "application/json"
      }
    });
  });
});
