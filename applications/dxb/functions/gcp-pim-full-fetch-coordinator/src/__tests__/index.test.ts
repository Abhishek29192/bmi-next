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

const getNumberOfDocuments = jest.fn();
jest.mock("../contentful", () => {
  return {
    getNumberOfDocuments: (...args: any) => getNumberOfDocuments(...args)
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
});

const handleRequest = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).handleRequest(
    request as Request,
    response as Response
  );

const productsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
const systemsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
const documentsIndex = process.env.ES_INDEX_NAME_DOCUMENTS;

describe("handleRequest", () => {
  it.each([
    "BUILD_TRIGGER_ENDPOINT",
    "FULL_FETCH_ENDPOINT",
    "SPACE_ID",
    "CONTENTFUL_ENVIRONMENT",
    "LOCALE",
    "MARKET_LOCALE",
    "CONTENTFUL_DELIVERY_TOKEN",
    "ES_INDEX_PREFIX",
    "ES_INDEX_NAME_DOCUMENTS"
  ])("Returns 500, when %s is not set", async (name) => {
    // eslint-disable-next-line security/detect-object-injection
    const original = process.env[name];
    // eslint-disable-next-line security/detect-object-injection
    delete process.env[name];

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).not.toHaveBeenCalled();
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    // eslint-disable-next-line security/detect-object-injection
    process.env[name] = original;
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).not.toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).not.toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).not.toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if deleting documents Elasticsearch index throws error", async () => {
    deleteElasticSearchIndex
      .mockResolvedValueOnce({})
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalled();
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).not.toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if creating documents Elasticsearch index throws error", async () => {
    createElasticSearchIndex
      .mockResolvedValueOnce({})
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith("products");
    expect(fetchData).not.toHaveBeenCalledWith("systems");
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).not.toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveFetched();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if triggering full fetch functions for products throws error", async () => {
    fetchData.mockResolvedValueOnce(
      createProductsApiResponse({ totalPageCount: 10 })
    );

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).not.toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should retry 5 times and eventually error if triggering full fetch functions for products if it returns error code 429", async () => {
    fetchData.mockResolvedValueOnce(
      createProductsApiResponse({ totalPageCount: 10 })
    );

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).not.toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should not retry and error if triggering full fetch functions for products if it returns non-429 error code", async () => {
    fetchData.mockResolvedValueOnce(
      createProductsApiResponse({ totalPageCount: 10 })
    );

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).not.toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if triggering full fetch functions for systems throws error", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should retry 5 times and eventually error if triggering full fetch functions for systems if it returns error code 429", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should not retry and error if triggering full fetch functions for systems if it returns non-429 error code", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if fetching documents throws error", async () => {
    fetchData.mockReset();
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockRejectedValueOnce(Error("Expected error"));

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 10
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should error if triggering full fetch functions for documents throws error", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should retry 5 times and eventually error if triggering full fetch functions for documents if it returns error code 429", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).toHaveFetchedTimes(5, process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should not retry and error if triggering full fetch functions for documents if it returns non-429 error code", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should return status 200", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if triggering build throws error", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if triggering build returns an error status", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should send multiple requests for multiple pages of data", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 16 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 12 }));
    getNumberOfDocuments.mockResolvedValueOnce(1357);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
        }
      },
      {
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 1,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 1,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if catalogue not found when trying to get products", async () => {
    fetchData
      .mockRejectedValueOnce(
        Error(
          `[PIM] Error getting catalogue:\n\nInvalidResourceError: Base site ${process.env.PIM_CATALOG_NAME} doesn't exist`
        )
      )
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

    mockResponses(
      fetchMock,
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
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if no products found", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 0 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

    mockResponses(
      fetchMock,
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
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if catalogue not found when trying to get systems", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockRejectedValueOnce(
        Error(
          `[PIM] Error getting catalogue:\n\nInvalidResourceError: Base site ${process.env.PIM_CATALOG_NAME} doesn't exist`
        )
      );
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if no systems found", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 0 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 if no documents found", async () => {
    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(0);

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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).not.toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should return status 200 filtering documents by tag if TAG provided", async () => {
    process.env.TAG = "market__belgium";

    fetchData
      .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
      .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
    getNumberOfDocuments.mockResolvedValueOnce(1000);

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
        url: process.env.FULL_FETCH_ENDPOINT,
        method: "POST",
        requestBody: {
          type: "documents",
          startPage: 0,
          numberOfPages: 1
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

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(getNumberOfDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      process.env.TAG
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith("products", process.env.LOCALE);
    expect(fetchData).toHaveBeenCalledWith("systems", process.env.LOCALE);
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
    expect(fetchMock).toHaveFetched(process.env.FULL_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        type: "documents",
        startPage: 0,
        numberOfPages: 1
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST"
    });
    expect(response.status).toHaveBeenCalledWith(200);

    delete process.env.TAG;
  });
});
