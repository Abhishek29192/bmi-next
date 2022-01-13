/**
 * Duplicated in gcp-full-fetch-coordinator. We should keep these in sync until we get shared libraries working for GCP Functions.
 */
import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockResponses } from "../../../../../../libraries/fetch-mocks/src/index";
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

const fetchData = (type: "products" | "systems", currentPage?: number) =>
  require("../pim").fetchData(type, currentPage);

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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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
      await fetchData("products");
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

    const response = await fetchData("products");

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

    const response = await fetchData("systems");

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

    const response = await fetchData("products", 18);

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
