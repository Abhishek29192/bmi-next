import mockConsole from "jest-mock-console";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";
import { handleRequest as realHandleRequest } from "..";
import {
  mockResponse,
  mockRequest,
  mockResponses
} from "../../../../../../libraries/fetch-mocks/src/index";
import { ElasticsearchIndexes } from "../elasticsearch";
import { FirestoreCollections } from "../firestore";
import { PimTypes } from "../pim";
import {
  createProductsApiResponse,
  createSystemsApiResponse
} from "./helpers/pimHelper";

const deleteElasticSearchIndex = jest.fn();
jest.mock("../elasticsearch", () => {
  // Throws "ReferenceError: setImmediate is not defined" with jest.requireActual
  enum ElasticsearchIndexes {
    Products = "products",
    Systems = "systems"
  }
  return {
    ElasticsearchIndexes: ElasticsearchIndexes,
    deleteElasticSearchIndex: (...args: any) =>
      deleteElasticSearchIndex(...args)
  };
});

const deleteFirestoreCollection = jest.fn();
jest.mock("../firestore", () => {
  const firestore = jest.requireActual("../firestore");
  return {
    ...firestore,
    deleteFirestoreCollection: (...args: any) =>
      deleteFirestoreCollection(...args)
  };
});

const fetchData = jest.fn();
jest.mock("../pim", () => {
  const pim = jest.requireActual("../pim");
  return {
    ...pim,
    fetchData: (...args: any) => fetchData(...args)
  };
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
  fetchData
    .mockResolvedValueOnce(createProductsApiResponse({ totalPageCount: 10 }))
    .mockResolvedValueOnce(createSystemsApiResponse({ totalPageCount: 10 }));
});

const handleRequest = (
  request: Partial<Request>,
  response: Partial<Response>
) => realHandleRequest(request as Request, response as Response);

describe("handleRequest", () => {
  it("should error if deleting products Elasticsearch index throws error", async () => {
    deleteElasticSearchIndex.mockRejectedValue(Error("Expected error"));
    const request = mockRequest("GET");
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).not.toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).not.toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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

  it("should error if triggering full fetch functions for products returns error code", async () => {
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
      expect(error.message).toEqual(
        "Failed to trigger full fetch patch for products: Internal Server Error"
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).not.toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
      expect(error.message).toEqual("Expected error");
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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

  it("should error if triggering full fetch functions for systems returns error code", async () => {
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
      expect(error.message).toEqual(
        "Failed to trigger full fetch patch for systems: Internal Server Error"
      );
    }

    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Products
    );
    expect(deleteElasticSearchIndex).toHaveBeenCalledWith(
      ElasticsearchIndexes.Systems
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Products
    );
    expect(deleteFirestoreCollection).toHaveBeenCalledWith(
      FirestoreCollections.Systems
    );
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Products);
    expect(fetchData).toHaveBeenCalledWith(PimTypes.Systems);
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
