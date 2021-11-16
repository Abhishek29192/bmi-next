import { protos } from "@google-cloud/secret-manager";
import { FetchMockStatic } from "fetch-mock";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import fetch from "node-fetch";
import { mockResponses } from "../../../../../../libraries/fetch-mocks/src/index";
import { fetchData, PimTypes } from "../pim";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "./helpers/pimHelper";

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const fetchMock = fetch as unknown as FetchMockStatic;
jest.mock("node-fetch", () => fetchMockJest.sandbox());

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

  it("should error if getting auth token throws error", async () => {
    mockResponses(fetchMock, {
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
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
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).not.toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Systems}`
    );
  });

  it("should error if getting auth token returns error code", async () => {
    mockResponses(fetchMock, {
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      method: "POST",
      status: 500
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Internal Server Error");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).not.toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Systems}`
    );
  });

  it("should error if getting response JSON throws error", async () => {
    mockResponses(fetchMock, {
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      method: "POST",
      body: ""
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        `invalid json response body at ${process.env.PIM_HOST}/authorizationserver/oauth/token reason: Unexpected end of JSON input`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).not.toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Systems}`
    );
  });

  it("should error if getting data throws error", async () => {
    mockResponses(
      fetchMock,
      {
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
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
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should error if getting data returns error code", async () => {
    mockResponses(
      fetchMock,
      {
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Internal Server Error");
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        }
      }
    );
  });

  it("should return products data", async () => {
    const apiResponse = createProductsApiResponse();
    mockResponses(
      fetchMock,
      {
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
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
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Products}`,
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

  it("should return systems data", async () => {
    const apiResponse = createSystemsApiResponse();
    mockResponses(
      fetchMock,
      {
        url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token"
        })
      },
      {
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Systems}`,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiResponse)
      }
    );

    const response = await fetchData(PimTypes.Systems);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const body = fetchMock.lastOptions(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`
    ).body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID);
    expectedUrlencoded.append("client_secret", "access-secret");
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}${PimTypes.Systems}`,
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
