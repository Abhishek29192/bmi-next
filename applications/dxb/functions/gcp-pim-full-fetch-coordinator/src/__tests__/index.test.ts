import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "@bmi/pim-types";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { ElasticsearchIndexes } from "../elasticsearch";
import { FirestoreCollections } from "../firestoreCollections";

const createElasticSearchIndex = jest.fn();
const deleteElasticSearchIndex = jest.fn();
jest.mock("../elasticsearch", () => {
  // Throws "ReferenceError: setImmediate is not defined" with jest.requireActual
  enum ElasticsearchIndexes {
    Products = "products",
    Systems = "systems"
  }

  return {
    ElasticsearchIndexes: ElasticsearchIndexes,
    createElasticSearchIndex: (...args: any) =>
      createElasticSearchIndex(...args),
    deleteElasticSearchIndex: (...args: any) =>
      deleteElasticSearchIndex(...args)
  };
});

const deleteFirestoreCollection = jest.fn();
jest.mock("../firestore", () => {
  return {
    deleteFirestoreCollection: (...args: any) =>
      deleteFirestoreCollection(...args)
  };
});

const fetchData = jest.fn();
jest.mock("@bmi/pim-api", () => {
  const pim = jest.requireActual("@bmi/pim-api");
  return {
    ...pim,
    fetchData: (...args: any) => fetchData(...args)
  };
});

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  fetchMock.reset();
  fetchData
    .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
    .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
});

const handleRequest = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).handleRequest(
    request as Request,
    response as Response
  );

describe("handleRequest", () => {
  it("should return 500 if BUILD_TRIGGER_ENDPOINT is not set", async () => {
    const originalBuildTriggerEndpoint = process.env.BUILD_TRIGGER_ENDPOINT;
    delete process.env.BUILD_TRIGGER_ENDPOINT;

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).not.toHaveBeenCalled();
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.BUILD_TRIGGER_ENDPOINT = originalBuildTriggerEndpoint;
  });

  it("should return 500 if FULL_FETCH_ENDPOINT is not set", async () => {
    const originalFullFetchEndpoint = process.env.FULL_FETCH_ENDPOINT;
    delete process.env.FULL_FETCH_ENDPOINT;

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).not.toHaveBeenCalled();
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.FULL_FETCH_ENDPOINT = originalFullFetchEndpoint;
  });

  it("should return 500 if LOCALE is not set", async () => {
    const originalLocale = process.env.LOCALE;
    delete process.env.LOCALE;

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).not.toHaveBeenCalled();
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.LOCALE = originalLocale;
  });

  it("should error if deleting products Elasticsearch index throws error", async () => {
    deleteElasticSearchIndex.mockRejectedValue(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).not.toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if deleting systems Elasticsearch index throws error", async () => {
    deleteElasticSearchIndex
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if creating products Elasticsearch index throws error", async () => {
    createElasticSearchIndex.mockRejectedValue(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).not.toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if creating systems Elasticsearch index throws error", async () => {
    createElasticSearchIndex
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if deleting products Firestore collection throws error", async () => {
    deleteFirestoreCollection.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if deleting systems Firestore collection throws error", async () => {
    deleteFirestoreCollection
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if fetching products throws error", async () => {
    fetchData.mockReset();
    fetchData.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if triggering full fetch functions for products throws error", async () => {
    mockResponses(fetchMock, {
      url: process.env.FULL_FETCH_ENDPOINT,
      method: "POST",
      requestBody: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      },
      error: Error("Expected error")
    });
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should retry 5 times and eventually error if triggering full fetch functions for products if it returns error code 429", async () => {
    mockResponses(fetchMock, {
      url: process.env.FULL_FETCH_ENDPOINT,
      method: "POST",
      requestBody: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      },
      status: 429
    });
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Failed request for "${process.env.FULL_FETCH_ENDPOINT}" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]`
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetchedTimes(5, process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should not retry and error if triggering full fetch functions for products if it returns non-429 error code", async () => {
    mockResponses(fetchMock, {
      url: process.env.FULL_FETCH_ENDPOINT,
      method: "POST",
      requestBody: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      },
      status: 500
    });
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Failed request for "${process.env.FULL_FETCH_ENDPOINT}" after 1 retries with the following errors: ["Internal Server Error - "]`
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if fetching systems throws error", async () => {
    fetchData.mockReset();
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockRejectedValueOnce(Error("Expected error"));
    mockResponses(fetchMock, {
      url: process.env.FULL_FETCH_ENDPOINT,
      method: "POST",
      requestBody: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if triggering full fetch functions for systems throws error", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        },
        error: Error("Expected error")
      }
    );
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should retry 5 times and eventually error if triggering full fetch functions for systems if it returns error code 429", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        },
        status: 429
      }
    );
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Failed request for "${process.env.FULL_FETCH_ENDPOINT}" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]`
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetchedTimes(5, process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should not retry and error if triggering full fetch functions for systems if it returns non-429 error code", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        },
        status: 500
      }
    );
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Failed request for "${process.env.FULL_FETCH_ENDPOINT}" after 1 retries with the following errors: ["Internal Server Error - "]`
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should return status 200", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if triggering build throws error", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST",
        error: new Error("Expected error")
      }
    );

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if triggering build returns an error status", async () => {
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST",
        status: 500
      }
    );

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should send multiple requests for multiple pages of data", async () => {
    fetchData.mockReset();
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 16 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 12 }));
    mockResponses(
      fetchMock,
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "products",
          startPage: 10,
          numberOfPages: 6
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 0,
          numberOfPages: 10
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "systems",
          startPage: 10,
          numberOfPages: 2
        }
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(createElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products");
    expect(fetchData).toHaveBeenCalledWith("systems");
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "products",
        startPage: 10,
        numberOfPages: 6
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "systems",
        startPage: 10,
        numberOfPages: 2
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
