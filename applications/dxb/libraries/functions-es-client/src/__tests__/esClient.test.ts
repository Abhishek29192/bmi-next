const mockClient = jest.fn();
jest.mock("@elastic/elasticsearch", () => {
  return {
    Client: function (...args: any[]) {
      return mockClient(...args);
    }
  };
});

const getSecret = jest.fn();
jest.mock("@bmi/functions-secret-client", () => {
  return { getSecret };
});

beforeEach(() => {
  delete process.env.USE_LOCAL_ES;
  process.env.ES_CLOUD_ID = "es-cloud-id";
  process.env.ES_USERNAME = "es-username";
  process.env.ES_PASSWORD_SECRET = "es-password-secret";

  jest.clearAllMocks();
  jest.resetModules();
});

const getEsClient = async () => (await import("../index")).getEsClient();

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
      expect((error as Error).message).toEqual("ES_CLOUD_ID was not provided");
    }

    expect(getSecret).toBeCalledTimes(0);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should error if ES_USERNAME is not set", async () => {
    delete process.env.ES_USERNAME;

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("ES_USERNAME was not provided");
    }

    expect(getSecret).toBeCalledTimes(0);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should error if ES_PASSWORD_SECRET is not set", async () => {
    delete process.env.ES_PASSWORD_SECRET;

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "ES_PASSWORD_SECRET was not provided"
      );
    }

    expect(getSecret).toBeCalledTimes(0);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should error if getSecret throws error", async () => {
    getSecret.mockRejectedValue(Error("Expected error"));

    try {
      await getEsClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getSecret).toBeCalledWith(process.env.ES_PASSWORD_SECRET);
    expect(mockClient).toBeCalledTimes(0);
  });

  it("should return a new client set from ES_CLOUD_ID and authentication", async () => {
    const esPassword = "es-password";
    getSecret.mockResolvedValue(esPassword);
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    const esClient = await getEsClient();

    expect(esClient).toStrictEqual(expectedClient);
    expect(getSecret).toBeCalledWith(process.env.ES_PASSWORD_SECRET);
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
    getSecret.mockResolvedValue(esPassword);
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    await getEsClient();
    await getEsClient();

    expect(getSecret).toBeCalledTimes(1);
    expect(getSecret).toBeCalledWith(process.env.ES_PASSWORD_SECRET);
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
