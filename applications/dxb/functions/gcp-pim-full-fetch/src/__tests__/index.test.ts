import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import {
  TypeDocument as ContentfulDocument,
  createDocument as createContentfulDocument
} from "@bmi/contentful-types";
import {
  Training as ESTraining,
  ContentfulDocument as EsContentfulDocument,
  createContentfulDocument as createEsContentfulDocument,
  createTraining as createEsTraining
} from "@bmi/elasticsearch-types";
import { fetchData as originalFetchData } from "@bmi/pim-api";
import {
  PimTypes,
  createProduct,
  createProductsApiResponse,
  createSystem,
  createSystemsApiResponse
} from "@bmi/pim-types";
import { Topic } from "@google-cloud/pubsub";
import { Request, Response } from "express";
import { fetchDoceboData as originalFetchDoceboData } from "../doceboDataHandler";
import { createFullFetchRequest } from "./helpers/fullFetchHelper";

const fetchData = jest.fn();
jest.mock("@bmi/pim-api", () => {
  const pim = jest.requireActual("@bmi/pim-api");
  return {
    ...pim,
    fetchData: (...args: Parameters<typeof originalFetchData>) =>
      fetchData(...args)
  };
});

const publishMessage = jest.fn();
jest.mock("@google-cloud/pubsub", () => {
  const mPubSub = jest.fn(() => ({
    topic: () => ({
      publishMessage: (
        ...args: Parameters<typeof Topic.prototype.publishMessage>
      ) => publishMessage(...args)
    })
  }));
  return { PubSub: mPubSub };
});

const fetchDoceboData = jest.fn();
jest.mock("../doceboDataHandler", () => ({
  fetchDoceboData: (...args: Parameters<typeof originalFetchDoceboData>) =>
    fetchDoceboData(...args)
}));

const getDocuments: jest.Mock<
  Promise<ContentfulDocument<undefined, "en-US">[]>,
  [string, number, string | undefined]
> = jest.fn();
jest.mock("../contentful", () => ({
  getDocuments: (locale: string, page: number, tag?: string) =>
    getDocuments(locale, page, tag)
}));

const transformDocuments: jest.Mock<
  EsContentfulDocument[],
  [ContentfulDocument<undefined, "en-US">[]]
> = jest.fn();
jest.mock("../documentTransformer", () => ({
  transformDocuments: (documents: ContentfulDocument<undefined, "en-US">[]) =>
    transformDocuments(documents)
}));

const indexIntoES: jest.Mock<
  Promise<void>,
  [(ContentfulDocument<undefined, "en-US"> | ESTraining)[], string]
> = jest.fn();
jest.mock("../elasticsearch", () => ({
  indexIntoES: (
    documents: ContentfulDocument<undefined, "en-US">[],
    indexName: string
  ) => indexIntoES(documents, indexName)
}));

beforeEach(() => {
  process.env.GCP_PROJECT_ID = "TEST_GCP_PROJECT_ID";
  process.env.TRANSITIONAL_TOPIC_NAME = "TEST_TRANSITIONAL_TOPIC_NAME";
  process.env.LOCALE = "en";
  process.env.MARKET_LOCALE = "en-US";
  jest.resetAllMocks();
  jest.resetModules();
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
  it("should return 500 if GCP_PROJECT_ID is not set", async () => {
    const originalGcpProjectId = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.GCP_PROJECT_ID = originalGcpProjectId;
  });

  it("should return 500 if TRANSITIONAL_TOPIC_NAME is not set", async () => {
    const originalTransitionalTopicName = process.env.TRANSITIONAL_TOPIC_NAME;
    delete process.env.TRANSITIONAL_TOPIC_NAME;

    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.TRANSITIONAL_TOPIC_NAME = originalTransitionalTopicName;
  });

  it("should return 500 if LOCALE is not set", async () => {
    const originalLocale = process.env.LOCALE;
    delete process.env.LOCALE;

    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.LOCALE = originalLocale;
  });

  it("should return 500 if MARKET_LOCALE is not set", async () => {
    const originalMarketLocale = process.env.MARKET_LOCALE;
    delete process.env.MARKET_LOCALE;

    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.MARKET_LOCALE = originalMarketLocale;
  });

  it("should return 500 if ES_INDEX_NAME_DOCUMENTS is not set", async () => {
    const origianlEsIndexNameDocuments = process.env.ES_INDEX_NAME_DOCUMENTS;
    delete process.env.ES_INDEX_NAME_DOCUMENTS;

    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.ES_INDEX_NAME_DOCUMENTS = origianlEsIndexNameDocuments;
  });

  it("should return 400 if body is not provided", async () => {
    const request = mockRequest({ method: "POST" });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "type was not provided."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if body does not contain type", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        startPage: 0,
        numberOfPages: 1
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({ error: "type was not provided." });
    expect(fetchData).not.toHaveBeenCalled();
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 500 if type===trainings and DOCEBO_API_URL is not set", async () => {
    const inintialDoceboApiUrl = process.env.DOCEBO_API_URL;
    delete process.env.DOCEBO_API_URL;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.DOCEBO_API_URL = inintialDoceboApiUrl;
  });

  it("should return 500 if type===trainings and DOCEBO_API_CLIENT_ID is not set", async () => {
    const inintialDoceboApiClientId = process.env.DOCEBO_API_CLIENT_ID;
    delete process.env.DOCEBO_API_CLIENT_ID;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.DOCEBO_API_CLIENT_ID = inintialDoceboApiClientId;
  });

  it("should return 500 if type===trainings and DOCEBO_API_CLIENT_SECRET is not set", async () => {
    const inintialDoceboApiClientSecret = process.env.DOCEBO_API_CLIENT_SECRET;
    delete process.env.DOCEBO_API_CLIENT_SECRET;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.DOCEBO_API_CLIENT_SECRET = inintialDoceboApiClientSecret;
  });

  it("should return 500 if type===trainings and DOCEBO_API_PASSWORD is not set", async () => {
    const inintialDoceboApiPassword = process.env.DOCEBO_API_PASSWORD;
    delete process.env.DOCEBO_API_PASSWORD;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.DOCEBO_API_PASSWORD = inintialDoceboApiPassword;
  });

  it("should return 500 if type===trainings and DOCEBO_API_USERNAME is not set", async () => {
    const inintialDoceboApiUsername = process.env.DOCEBO_API_USERNAME;
    delete process.env.DOCEBO_API_USERNAME;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.DOCEBO_API_USERNAME = inintialDoceboApiUsername;
  });

  it("should return 500 if type===trainings and ES_INDEX_NAME_TRAININGS is not set", async () => {
    const inintialEsIndexNameTrainings = process.env.ES_INDEX_NAME_TRAININGS;
    delete process.env.ES_INDEX_NAME_TRAININGS;
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: { type: "trainings", startPage: 1, numberOfPages: 1 }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    process.env.ES_INDEX_NAME_TRAININGS = inintialEsIndexNameTrainings;
  });

  it("should return 400 if type===trainings and catalogueId is not provided", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "trainings",
        startPage: 1,
        numberOfPages: 1,
        catalogueId: undefined
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith("catalogueId was not provided");
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if type===trainings and itemIds is not provided", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "trainings",
        startPage: 1,
        numberOfPages: 1,
        catalogueId: 10,
        itemIds: undefined
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(
      "itemIds field was not provided"
    );
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if type===trainings and itemIds is not array", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "trainings",
        startPage: 1,
        numberOfPages: 1,
        catalogueId: 10,
        itemIds: "fake value"
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith("itemIds should be an array");
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if type===trainings and itemIds is an empty array", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "trainings",
        startPage: 1,
        numberOfPages: 1,
        catalogueId: 10,
        itemIds: []
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(
      "training IDs were not provided"
    );
    expect(fetchDoceboData).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("inserts trainings into ES index", async () => {
    const training = createEsTraining();
    fetchDoceboData.mockResolvedValue([training]);
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "trainings",
        startPage: 1,
        numberOfPages: 1,
        catalogueId: 1,
        itemIds: [1]
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(fetchDoceboData).toHaveBeenCalledWith(
      request.body.catalogueId,
      request.body.itemIds
    );
    expect(indexIntoES).toHaveBeenCalledWith(
      [training],
      process.env.ES_INDEX_NAME_TRAININGS
    );
  });

  it("should return 400 if body does not contain startPage", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "products",
        numberOfPages: 1
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "startPage was not provided."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if startPage is less than 0", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "products",
        startPage: -1,
        numberOfPages: 1
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "startPage must be a number greater than or equal to 0."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if body does not contain numberOfPages", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "products",
        startPage: 0
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "numberOfPages was not provided."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if numberOfPages is less than 0", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: -1
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "numberOfPages must be a number greater than 0."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if numberOfPages is 0", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: {
        type: "products",
        startPage: 0,
        numberOfPages: 0
      }
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "numberOfPages must be a number greater than 0."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should error when fetching data from PIM throws error", async () => {
    fetchData.mockRejectedValue(Error("Expected error"));
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should error when publishing data to pub/sub throws error", async () => {
    const productsApiResponse = createProductsApiResponse();
    fetchData.mockReturnValue(productsApiResponse);
    publishMessage.mockRejectedValue(Error("Expected error"));
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse.products[0]
      }
    });
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should do nothing if no products found", async () => {
    const productsApiResponse = createProductsApiResponse({ products: [] });
    fetchData.mockReturnValue(productsApiResponse);
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).not.toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse.products[0]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should publish products data to pub/sub", async () => {
    const productsApiResponse = createProductsApiResponse();
    fetchData.mockReturnValue(productsApiResponse);
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse.products[0]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should publish multiple messages from single page with multiple products to pub/sub", async () => {
    const productsApiResponse = createProductsApiResponse({
      products: [createProduct({ code: "1" }), createProduct({ code: "2" })]
    });
    fetchData.mockReturnValueOnce(productsApiResponse);
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse.products[0]
      }
    });
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse.products[1]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should do nothing if no systems found", async () => {
    const systemsApiResponse = createSystemsApiResponse({ systems: [] });
    fetchData.mockReturnValue(systemsApiResponse);
    const fullFetchRequest = createFullFetchRequest({ type: PimTypes.Systems });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).not.toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: systemsApiResponse.systems[0]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should publish systems data to pub/sub", async () => {
    const systemsApiResponse = createSystemsApiResponse();
    fetchData.mockReturnValue(systemsApiResponse);
    const fullFetchRequest = createFullFetchRequest({ type: PimTypes.Systems });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: systemsApiResponse.systems[0]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should publish multiple messages from single page with multiple systems to pub/sub", async () => {
    const systemsApiResponse = createSystemsApiResponse({
      systems: [createSystem({ code: "1" }), createSystem({ code: "2" })]
    });
    fetchData.mockReturnValueOnce(systemsApiResponse);
    const fullFetchRequest = createFullFetchRequest({ type: PimTypes.Systems });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: systemsApiResponse.systems[0]
      }
    });
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: systemsApiResponse.systems[1]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should publish data from multiple pages to pub/sub", async () => {
    const productsApiResponse1 = createProductsApiResponse({
      products: [createProduct({ code: "1" })]
    });
    const productsApiResponse2 = createProductsApiResponse({
      products: [createProduct({ code: "2" })]
    });
    fetchData
      .mockReturnValueOnce(productsApiResponse1)
      .mockReturnValueOnce(productsApiResponse2);
    const fullFetchRequest = createFullFetchRequest({ numberOfPages: 2 });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage
    );
    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      process.env.LOCALE,
      fullFetchRequest.startPage + 1
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse1.products[0]
      }
    });
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: fullFetchRequest.type.toUpperCase(),
        item: productsApiResponse2.products[0]
      }
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should error when fetching data from Contentful throws error", async () => {
    getDocuments.mockRejectedValue(Error("Expected error"));
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      fullFetchRequest.startPage,
      undefined
    );
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should do nothing when no documents found", async () => {
    getDocuments.mockResolvedValueOnce([]);
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(getDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      fullFetchRequest.startPage,
      undefined
    );
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should error when indexing documents into Elasticsearch throws error", async () => {
    const contentfulDocuments = [createContentfulDocument()];
    getDocuments.mockResolvedValueOnce(contentfulDocuments);
    const esContentfulDocuments = [createEsContentfulDocument()];
    transformDocuments.mockReturnValueOnce(esContentfulDocuments);
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    indexIntoES.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      fullFetchRequest.startPage,
      undefined
    );
    expect(transformDocuments).toHaveBeenCalledWith(contentfulDocuments);
    expect(indexIntoES).toHaveBeenCalledWith(
      esContentfulDocuments,
      process.env.ES_INDEX_NAME_DOCUMENTS
    );
  });

  it("should filter documents by TAG and index transformed documents into Elasticsearch", async () => {
    process.env.TAG = "contentful-tag";
    const contentfulDocuments = [createContentfulDocument()];
    getDocuments.mockResolvedValueOnce(contentfulDocuments);
    const esContentfulDocuments = [createEsContentfulDocument()];
    transformDocuments.mockReturnValueOnce(esContentfulDocuments);
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    const request = mockRequest({
      method: "POST",
      headers: {},
      url: "",
      body: fullFetchRequest
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(getDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      fullFetchRequest.startPage,
      process.env.TAG
    );
    expect(transformDocuments).toHaveBeenCalledWith(contentfulDocuments);
    expect(indexIntoES).toHaveBeenCalledWith(
      esContentfulDocuments,
      process.env.ES_INDEX_NAME_DOCUMENTS
    );
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    delete process.env.TAG;
  });
});
