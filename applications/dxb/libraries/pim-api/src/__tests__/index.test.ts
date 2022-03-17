import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import { PimTypes } from "@bmi/pim-types";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "./helpers/pimHelper";

const pimAuthTokenUrl = `${process.env.PIM_HOST}/authorizationserver/oauth/token`;
const pimProductsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=0&approvalStatus=APPROVED`;
const pimSystemsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?currentPage=0&approvalStatus=APPROVED`;

const getSecret = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const fetchData = async (type: PimTypes, currentPage?: number) =>
  (await import("../index")).fetchData(type, currentPage);

const getProductsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number
) =>
  (await import("../index")).getProductsByMessageId(
    messageId,
    token,
    currentPage
  );

const getSystemsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number
) =>
  (await import("../index")).getSystemsByMessageId(
    messageId,
    token,
    currentPage
  );

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("fetchData", () => {
  it("should error if PIM_CLIENT_ID is not set", async () => {
    const originalPimClientId = process.env.PIM_CLIENT_ID;
    delete process.env.PIM_CLIENT_ID;

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "PIM_CLIENT_ID has not been set."
      );
    }

    expect(getSecret).toHaveBeenCalledTimes(0);
    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_CLIENT_ID = originalPimClientId;
  });

  it("should error if PIM_CLIENT_SECRET is not set", async () => {
    const originalPimClientSecret = process.env.PIM_CLIENT_SECRET;
    delete process.env.PIM_CLIENT_SECRET;

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "PIM_CLIENT_SECRET has not been set."
      );
    }

    expect(getSecret).toHaveBeenCalledTimes(0);
    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if getting getSecret throws error", async () => {
    getSecret.mockRejectedValue(Error("Expected error"));

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should error if getting auth token throws error", async () => {
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      error: Error("Expected error")
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      status: 500
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "[PIM] Error getting auth token: 500 Internal Server Error"
      );
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      body: ""
    });

    try {
      await fetchData(PimTypes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `invalid json response body at ${pimAuthTokenUrl} reason: Unexpected end of JSON input`
      );
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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
      expect((error as Error).message).toEqual(
        "[PIM] Error getting data: 500 Internal Server Error"
      );
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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

    const response = await fetchData(PimTypes.Systems);

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);

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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append("client_secret", pimClientSecret);
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

    expect(getSecret).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();

    process.env.PIM_CLIENT_ID = originalPimClientId;
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

    expect(getSecret).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();

    process.env.PIM_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if getting getSecret throws error", async () => {
    getSecret.mockRejectedValue(Error("Expected error"));

    try {
      await getProductsByMessageId("message-id", "token", 1);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
    expect(fetchMock).not.toHaveFetched();
  });

  it("should error if authorization request returns a non-ok response", async () => {
    const pimClientSecret = "secret";
    getSecret.mockResolvedValue(pimClientSecret);
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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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
    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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
    getSecret.mockResolvedValue(pimClientSecret);
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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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

    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
    getSecret.mockResolvedValue(pimClientSecret);
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
    expect(getSecret).toHaveBeenCalledWith(process.env.PIM_CLIENT_SECRET);
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
