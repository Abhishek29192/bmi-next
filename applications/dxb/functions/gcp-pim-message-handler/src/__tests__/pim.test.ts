import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockResponses } from "../../../../../../libraries/fetch-mocks/src/index";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const getProducts = (messageId: string, token: string, currentPage: number) =>
  require("../pim").getProducts(messageId, token, currentPage);
const getSystems = (messageId: string, token: string, currentPage: number) =>
  require("../pim").getSystems(messageId, token, currentPage);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("getProducts", () => {
  it("should error if PIM_CLIENT_ID has not been set", async () => {
    const originalPimClientId = process.env.PIM_CLIENT_ID;
    delete process.env.PIM_CLIENT_ID;

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual("PIM_CLIENT_ID has not been set.");
    }

    expect(accessSecretVersion).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();

    process.env.PIM_CLIENT_ID = originalPimClientId;
  });

  it("should error if SECRET_MAN_GCP_PROJECT_NAME has not been set", async () => {
    const originalSecretManGcpProjectName =
      process.env.SECRET_MAN_GCP_PROJECT_NAME;
    delete process.env.SECRET_MAN_GCP_PROJECT_NAME;

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        "SECRET_MAN_GCP_PROJECT_NAME has not been set."
      );
    }

    expect(accessSecretVersion).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();

    process.env.SECRET_MAN_GCP_PROJECT_NAME = originalSecretManGcpProjectName;
  });

  it("should error if PIM_CLIENT_SECRET has not been set", async () => {
    const originalPimClientSecret = process.env.PIM_CLIENT_SECRET;
    delete process.env.PIM_CLIENT_SECRET;

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        "PIM_CLIENT_SECRET has not been set."
      );
    }

    expect(accessSecretVersion).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();

    process.env.PIM_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if getting pim client secret returns undefined payload", async () => {
    accessSecretVersion.mockResolvedValue([{}]);

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `pimClientSecret could not be retrieved.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).not.toHaveFetched();
  });

  it("should error if getting pim client secret returns undefined payload data", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: {} }]);

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `pimClientSecret could not be retrieved.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).not.toHaveFetched();
  });

  it("should error if authorization request returns a non-ok response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    mockResponses(fetchMock, {
      method: "POST",
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      status: 401
    });

    try {
      await getProducts("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting auth token: 401 Unauthorized`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
  });

  it("should error if product request returns a non-ok response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        status: 500,
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        }
      }
    );

    try {
      await getProducts(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting data: 500 Internal Server Error`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", pimClientSecret);
    urlencoded.append("grant_type", "client_credentials");
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should return all errors if product request returns a bad request response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        status: 400,
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        }
      }
    );

    try {
      await getProducts(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", pimClientSecret);
    urlencoded.append("grant_type", "client_credentials");
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should return products from API", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    const expectedProducts = { products: [{ name: "product-1" }] };
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        body: expectedProducts
      }
    );

    const actualProducts = await getProducts(messageId, token, currentPage);

    expect(actualProducts).toStrictEqual(expectedProducts);
    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });
});

describe("getSystems", () => {
  it("should error if authorization request returns a non-ok response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    mockResponses(fetchMock, {
      method: "POST",
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      status: 401
    });

    try {
      await getSystems("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting auth token: 401 Unauthorized`
      );
    }
  });

  it("should error if system request returns a non-ok response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        status: 500,
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        }
      }
    );

    try {
      await getSystems(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting data: 500 Internal Server Error`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", pimClientSecret);
    urlencoded.append("grant_type", "client_credentials");
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should error with all errors if system request returns a bad request response", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        status: 400,
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        }
      }
    );

    try {
      await getSystems(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", pimClientSecret);
    urlencoded.append("grant_type", "client_credentials");
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should return systems from API", async () => {
    const pimClientSecret = "secret";
    accessSecretVersion.mockResolvedValue([
      {
        payload: {
          data: pimClientSecret
        }
      }
    ]);
    const accessToken = "access-token";
    const messageId = "message-id";
    const token = "token";
    const currentPage = 1;
    const expectedProducts = { products: [{ name: "product-1" }] };
    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: { access_token: accessToken }
      },
      {
        method: "GET",
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
        body: expectedProducts
      }
    );

    const actualProducts = await getSystems(messageId, token, currentPage);

    expect(actualProducts).toStrictEqual(expectedProducts);
    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    )!.body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedBody.append("client_secret", pimClientSecret);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  });
});
