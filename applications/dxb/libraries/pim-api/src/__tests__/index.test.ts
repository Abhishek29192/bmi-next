import { mockResponses } from "@bmi-digital/fetch-mocks";
import { PimTypes } from "@bmi/pim-types";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "./helpers/pimHelper";

const pimAuthTokenUrl = `${process.env.PIM_HOST}/authorizationserver/oauth/token`;
const pimProductsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=0&status=approved&lang=${process.env.LOCALE}`;
const pimSystemsUrl = `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?currentPage=0&status=approved&lang=${process.env.LOCALE}`;

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const fetchData = async (
  type: PimTypes,
  locale: string,
  currentPage?: number
) => (await import("../index")).fetchData(type, locale, currentPage);

const getProductsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number,
  locale: string
) =>
  (await import("../index")).getProductsByMessageId(
    messageId,
    token,
    currentPage,
    locale
  );

const getSystemsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number,
  locale: string
) =>
  (await import("../index")).getSystemsByMessageId(
    messageId,
    token,
    currentPage,
    locale
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "PIM_CLIENT_ID has not been set."
      );
    }

    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_CLIENT_ID = originalPimClientId;
  });

  it("should error if PIM_OAUTH_CLIENT_SECRET is not set", async () => {
    const originalPimClientSecret = process.env.PIM_OAUTH_CLIENT_SECRET;
    delete process.env.PIM_OAUTH_CLIENT_SECRET;

    try {
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "PIM_OAUTH_CLIENT_SECRET has not been set."
      );
    }

    expect(fetchMock).not.toHaveBeenCalled();

    process.env.PIM_OAUTH_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if getting auth token throws error", async () => {
    mockResponses(fetchMock, {
      url: pimAuthTokenUrl,
      method: "POST",
      error: Error("Expected error")
    });

    try {
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "[PIM] Error getting auth token: 500 Internal Server Error"
      );
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `invalid json response body at ${pimAuthTokenUrl} reason: Unexpected end of JSON input`
      );
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "[PIM] Error getting data: 500 Internal Server Error"
      );
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
      await fetchData(PimTypes.Products, process.env.LOCALE!);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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

    const response = await fetchData(PimTypes.Products, process.env.LOCALE!);

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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

    const response = await fetchData(PimTypes.Systems, process.env.LOCALE!);

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=18&status=approved&lang=${process.env.LOCALE}`,
        method: "GET",
        headers: {
          Authorization: `Bearer access_token`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiResponse)
      }
    );

    const response = await fetchData(
      PimTypes.Products,
      process.env.LOCALE!,
      18
    );

    const body = fetchMock.lastOptions(pimAuthTokenUrl)!.body;
    const expectedUrlencoded = new URLSearchParams();
    expectedUrlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    expectedUrlencoded.append(
      "client_secret",
      process.env.PIM_OAUTH_CLIENT_SECRET!
    );
    expectedUrlencoded.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedUrlencoded);
    expect(fetchMock).toHaveFetched(pimAuthTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?currentPage=18&status=approved&lang=${process.env.LOCALE}`,
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
      await getProductsByMessageId(
        "message-id",
        "token",
        1,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "PIM_CLIENT_ID has not been set."
      );
    }

    process.env.PIM_CLIENT_ID = originalPimClientId;
  });

  it("should error if PIM_OAUTH_CLIENT_SECRET has not been set", async () => {
    const originalPimClientSecret = process.env.PIM_OAUTH_CLIENT_SECRET;
    delete process.env.PIM_OAUTH_CLIENT_SECRET;

    try {
      await getProductsByMessageId(
        "message-id",
        "token",
        1,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "PIM_OAUTH_CLIENT_SECRET has not been set."
      );
    }

    process.env.PIM_OAUTH_CLIENT_SECRET = originalPimClientSecret;
  });

  it("should error if authorization request returns a non-ok response", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      status: 401
    });

    try {
      await getProductsByMessageId(
        "message-id",
        "token",
        1,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting auth token: 401 Unauthorized`
      );
    }

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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
  });

  it("should error if product request returns a non-ok response", async () => {
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
      await getProductsByMessageId(
        messageId,
        token,
        currentPage,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting data: 500 Internal Server Error`
      );
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
      await getProductsByMessageId(
        messageId,
        token,
        currentPage,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
        body: expectedProducts
      }
    );

    const actualProducts = await getProductsByMessageId(
      messageId,
      token,
      currentPage,
      process.env.LOCALE!
    );

    expect(actualProducts).toStrictEqual(expectedProducts);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/products?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
    mockResponses(fetchMock, {
      method: "POST",
      url: `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
      status: 401
    });

    try {
      await getSystemsByMessageId(
        "message-id",
        "token",
        1,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting auth token: 401 Unauthorized`
      );
    }
  });

  it("should error if system request returns a non-ok response", async () => {
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
      await getSystemsByMessageId(
        messageId,
        token,
        currentPage,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting data: 500 Internal Server Error`
      );
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
      await getSystemsByMessageId(
        messageId,
        token,
        currentPage,
        process.env.LOCALE!
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `[PIM] Error getting catalogue:\n\nerror1: Expected error 1\n\nerror2: Expected error 2`
      );
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.PIM_CLIENT_ID!);
    urlencoded.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
        url: `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
        body: expectedProducts
      }
    );

    const actualProducts = await getSystemsByMessageId(
      messageId,
      token,
      currentPage,
      process.env.LOCALE!
    );

    expect(actualProducts).toStrictEqual(expectedProducts);
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
    expectedBody.append("client_secret", process.env.PIM_OAUTH_CLIENT_SECRET!);
    expectedBody.append("grant_type", "client_credentials");
    expect(body).toStrictEqual(expectedBody);
    expect(fetchMock).toHaveFetched(
      `${process.env.PIM_HOST}/bmiwebservices/v2/${process.env.PIM_CATALOG_NAME}/export/systems?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${process.env.LOCALE}`,
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
