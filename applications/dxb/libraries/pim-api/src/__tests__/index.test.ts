import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockResponses } from "@bmi/fetch-mocks";
import { getProductsByMessageId, getSystemsByMessageId, PimTypes } from "..";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "./helpers/pimHelper";

const pimAuthTokenUrl = `${process.env.PIM_HOST}/authorizationserver/oauth/token`;
const pimProductsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=0&approvalStatus=APPROVED`;
const pimSystemsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?currentPage=0&approvalStatus=APPROVED`;

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const fetchData = async (type: PimTypes, currentPage?: number) =>
  (await import("../index")).fetchData(type, currentPage);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  fetchMock.reset();
  accessSecretVersion.mockResolvedValue([
    { payload: { data: "access-secret" } }
  ]);
});

describe("fetchData", () => {
  it("should error if PIM_CLIENT_ID is not set", async () => {
    const originalPimClientId = process.env.PIM_CLIENT_ID;
    delete process.env.PIM_CLIENT_ID;

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("PIM_CLIENT_ID has not been set.");
    }

    expect(accessSecretVersion).toHaveBeenCalledTimes(0);
    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_CLIENT_ID = originalPimClientId;
  });

  it("should error if SECRET_MAN_GCP_PROJECT_NAME is not set", async () => {
    const originalSecretManGcpProjectName =
      process.env.SECRET_MAN_GCP_PROJECT_NAME;
    delete process.env.SECRET_MAN_GCP_PROJECT_NAME;

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        "SECRET_MAN_GCP_PROJECT_NAME has not been set."
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledTimes(0);
    expect(fetchMock).not.toHaveBeenCalled();

    process.env.SECRET_MAN_GCP_PROJECT_NAME = originalSecretManGcpProjectName;
  });

  it("should error if PIM_CLIENT_SECRET is not set", async () => {
    const originalPimClientSecret = process.env.PIM_CLIENT_SECRET;
    delete process.env.PIM_CLIENT_SECRET;

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("PIM_CLIENT_SECRET has not been set.");
    }

    expect(accessSecretVersion).toHaveBeenCalledTimes(0);
    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if getting pim secret throws error", async () => {
    accessSecretVersion.mockRejectedValue(Error("Expected error"));

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should error if getting pim secret returns undefined payload", async () => {
    accessSecretVersion.mockResolvedValue([{}]);

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("pimClientSecret could not be retrieved.");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should error if getting pim secret returns undefined payload data", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: {} }]);

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("pimClientSecret could not be retrieved.");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should error if getting auth token throws error", async () => {
    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      error: Error("Expected error")
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).not.toHaveFetched(pimSystemsUrl);
  });

  it("should error if getting auth token returns error code", async () => {
    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      status: 500
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        "[PIM] Error getting auth token: 500 Internal Server Error"
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).not.toHaveFetched(pimSystemsUrl);
  });

  it("should error if getting response JSON throws error", async () => {
    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      body: ""
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        `invalid json response body at ${pimAuthTokenUrl} reason: Unexpected end of JSON input`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).not.toHaveFetched(pimSystemsUrl);
  });

  it("should error if getting data throws error", async () => {
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: pimProductsUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        error: Error("Expected error")
      }
    );

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(pimProductsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer access_token`,
        "Content-Type": "application/json"
      }
    });
  });

  it("should error if getting data returns error code", async () => {
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: pimProductsUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        },
        status: 500
      }
    );

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        "[PIM] Error getting data: 500 Internal Server Error"
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(pimProductsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer access_token`,
        "Content-Type": "application/json"
      }
    });
  });

  it("should error with all errors if getting data returns bad request error code", async () => {
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: pimProductsUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: {
          errors: [
            { type: "error1", message: "Expected error 1" },
            { type: "error2", message: "Expected error 2" }
          ]
        },
        status: 400
      }
    );

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(pimProductsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer access_token`,
        "Content-Type": "application/json"
      }
    });
  });

  it("should return products data", async () => {
    const apiResponse = createProductsApiResponse();
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: pimProductsUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiResponse)
      }
    );

    const response = await fetchData(PimTypes.Products);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(pimProductsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer access_token`,
        "Content-Type": "application/json"
      }
    });
    expect(response).toEqual(apiResponse);
  });

  it("should return systems data", async () => {
    const apiResponse = createSystemsApiResponse();
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: pimSystemsUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiResponse)
      }
    );

    const response = await fetchData(PimTypes.Products);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(pimSystemsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer access_token`,
        "Content-Type": "application/json"
      }
    });
    expect(response).toEqual(apiResponse);
  });

  it("should return provided current pages data", async () => {
    const apiResponse = createProductsApiResponse();
    mockResponses(
      fetchMock,
      {
        url: pimAuthTokenUrl,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=18&approvalStatus=APPROVED`,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiResponse)
      }
    );

    const response = await fetchData(PimTypes.Products, 18);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=18&approvalStatus=APPROVED`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        }
      }
    );
    expect(response).toEqual(apiResponse);
  });
});

describe("getProductsByMessageId", () => {
  it("should error if PIM_CLIENT_ID has not been set", async () => {
    const originalPimClientId = process.env.PIM_CLIENT_ID;
    delete process.env.PIM_CLIENT_ID;

    try {
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "PIM_CLIENT_ID has not been set."
      );
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
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getProductsByMessageId(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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

    const actualProducts = await getProductsByMessageId(
      messageId,
      token,
      currentPage
    );

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

describe("getSystemsByMessageId", () => {
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
      await getSystemsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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
      await getSystemsByMessageId(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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

  it("should return all errors if system request returns a bad request response", async () => {
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
      await getSystemsByMessageId(messageId, token, currentPage);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
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

    const actualProducts = await getSystemsByMessageId(
      messageId,
      token,
      currentPage
    );

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
