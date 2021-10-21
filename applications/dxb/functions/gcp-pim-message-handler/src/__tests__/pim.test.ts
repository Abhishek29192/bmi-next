import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import fetchMockJest from "fetch-mock-jest";
import { FetchMockSandbox, MockCall } from "fetch-mock";
import fetch from "node-fetch";
import { getProducts, getSystems } from "../pim";
import { mockResponses } from "../../../../../../libraries/fetch-mocks/src/index";

jest.mock("node-fetch", () => fetchMockJest.sandbox());
const fetchMock = fetch as unknown as jest.MockInstance<Response, MockCall> &
  FetchMockSandbox;

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("getProducts", () => {
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
        `[PIM] Error fetching catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID);
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
    ).body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID);
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
    ).body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID);
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
        `[PIM] Error fetching catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.PIM_CLIENT_SECRET}/versions/latest`
    });
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID);
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
    ).body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID);
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
    ).body;
    const expectedBody = new URLSearchParams();
    expectedBody.append("client_id", process.env.PIM_CLIENT_ID);
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
