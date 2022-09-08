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
import { getEsDocumentMock } from "../__mocks__/contentful.mock";

const createElasticSearchIndex = jest.fn();
const deleteElasticSearchIndex = jest.fn();
const processContentfulDocuments = jest.fn();
const performBulkIndexing = jest.fn();
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
      deleteElasticSearchIndex(...args),
    performBulkIndexing: (...args: any) => performBulkIndexing(...args)
  };
});
jest.mock("../contentful", () => {
  return {
    processContentfulDocuments: (...args: any) =>
      processContentfulDocuments(...args)
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

const productsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
const systemsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
const documentsIndex = process.env.ES_INDEX_NAME_DOCUMENTS;

describe("handleRequest", () => {
  it.each([
    "BUILD_TRIGGER_ENDPOINT",
    "FULL_FETCH_ENDPOINT",
    "SPACE_ID",
    "LOCALE",
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
    processContentfulDocuments.mockResolvedValueOnce([getEsDocumentMock()]);

    const request = mockRequest("GET");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(productsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(systemsIndex);
    expect(createElasticSearchIndex).toHaveBeenCalledWith(documentsIndex);
    expect(processContentfulDocuments).toBeCalled();
    expect(performBulkIndexing).toBeCalled();
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

  it("should error if fetching contentful documents throws error", async () => {
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
    processContentfulDocuments.mockRejectedValueOnce(
      Error("Somothing goes wrong.")
    );
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Somothing goes wrong.");
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
    expect(processContentfulDocuments).toBeCalled();
    expect(performBulkIndexing).not.toBeCalled();
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toBeCalled();
  });
  it("shouldn't perform elasticsearch bulk operation if list of contenful documents is empty", async () => {
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
    processContentfulDocuments.mockResolvedValueOnce([]);
    const request = mockRequest("GET");
    const response = mockResponse();
    await handleRequest(request, response);
    expect(processContentfulDocuments).toBeCalled();
    expect(performBulkIndexing).not.toBeCalled();
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).toBeCalledWith(200);
  });

  it("should error if elasticsearch bulk operation throw an error", async () => {
    performBulkIndexing.mockRejectedValueOnce(Error("Expected error"));
    processContentfulDocuments.mockResolvedValueOnce([getEsDocumentMock()]);
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
    expect(processContentfulDocuments).toBeCalled();
    expect(performBulkIndexing).toBeCalled();
    expect(fetchMock).not.toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT);
    expect(response.status).not.toBeCalled();
  });
});
