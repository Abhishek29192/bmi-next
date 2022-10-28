import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import {
  createDocument as createContentfulDocument,
  createEntry,
  Document as ContentfulDocument
} from "@bmi/contentful-types";
import {
  ContentfulDocument as EsContentfulDocument,
  createContentfulDocument as createEsContentfulDocument
} from "@bmi/elasticsearch-types";
import {
  createProduct,
  createProductsApiResponse,
  createSystem,
  createSystemsApiResponse,
  PimTypes
} from "@bmi/pim-types";
import { Entry } from "contentful";
import { Request, Response } from "express";
import mockConsole from "jest-mock-console";
import { createFullFetchRequest } from "./helpers/fullFetchHelper";

const fetchData = jest.fn();
jest.mock("@bmi/pim-api", () => {
  const pim = jest.requireActual("@bmi/pim-api");
  return {
    ...pim,
    fetchData: (...args: any) => fetchData(...args)
  };
});

const publishMessage = jest.fn();
jest.mock("@google-cloud/pubsub", () => {
  const mPubSub = jest.fn(() => ({
    topic: (...args: any) => ({
      publishMessage: (...args: any) => publishMessage(...args)
    })
  }));
  return { PubSub: mPubSub };
});

const getDocuments: jest.Mock<
  Promise<Entry<ContentfulDocument>[]>,
  [string, number, string | undefined]
> = jest.fn();
jest.mock("../contentful", () => ({
  getDocuments: (locale: string, page: number, tag?: string) =>
    getDocuments(locale, page, tag)
}));

const transformDocuments: jest.Mock<
  EsContentfulDocument[],
  [Entry<ContentfulDocument>[]]
> = jest.fn();
jest.mock("../documentTransformer", () => ({
  transformDocuments: (documents: Entry<ContentfulDocument>[]) =>
    transformDocuments(documents)
}));

const indexIntoES: jest.Mock<Promise<void>, [ContentfulDocument[]]> = jest.fn();
jest.mock("../elasticsearch", () => ({
  indexIntoES: (documents: ContentfulDocument[]) => indexIntoES(documents)
}));

beforeAll(() => {
  mockConsole();
});

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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);

    process.env.ES_INDEX_NAME_DOCUMENTS = origianlEsIndexNameDocuments;
  });

  it("should return 400 if body is not provided", async () => {
    const request = mockRequest("POST");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "type, startPage and numberOfPages was not provided."
    });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if body does not contain type", async () => {
    const request = mockRequest("POST", {}, "", {
      startPage: 0,
      numberOfPages: 1
    });
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({ error: "type was not provided." });
    expect(fetchData).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
    expect(getDocuments).not.toHaveBeenCalled();
    expect(transformDocuments).not.toHaveBeenCalled();
    expect(indexIntoES).not.toHaveBeenCalled();
  });

  it("should return 400 if body does not contain startPage", async () => {
    const request = mockRequest("POST", {}, "", {
      type: "products",
      numberOfPages: 1
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

  it("should return 400 if startPage is less than 0", async () => {
    const request = mockRequest("POST", {}, "", {
      type: "products",
      startPage: -1,
      numberOfPages: 1
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
    const request = mockRequest("POST", {}, "", {
      type: "products",
      startPage: 0
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

  it("should return 400 if numberOfPages is less than 0", async () => {
    const request = mockRequest("POST", {}, "", {
      type: "products",
      startPage: 0,
      numberOfPages: -1
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
    const request = mockRequest("POST", {}, "", {
      type: "products",
      startPage: 0,
      numberOfPages: 0
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    const contentfulDocuments = [
      createEntry({
        fields: createContentfulDocument()
      })
    ];
    getDocuments.mockResolvedValueOnce(contentfulDocuments);
    const esContentfulDocuments = [createEsContentfulDocument()];
    transformDocuments.mockReturnValueOnce(esContentfulDocuments);
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    indexIntoES.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest("POST", {}, "", fullFetchRequest);
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
    expect(indexIntoES).toHaveBeenCalledWith(esContentfulDocuments);
  });

  it("should filter documents by TAG and index transformed documents into Elasticsearch", async () => {
    process.env.TAG = "contentful-tag";
    const contentfulDocuments = [
      createEntry({
        fields: createContentfulDocument()
      })
    ];
    getDocuments.mockResolvedValueOnce(contentfulDocuments);
    const esContentfulDocuments = [createEsContentfulDocument()];
    transformDocuments.mockReturnValueOnce(esContentfulDocuments);
    const fullFetchRequest = createFullFetchRequest({ type: "documents" });
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(getDocuments).toHaveBeenCalledWith(
      process.env.MARKET_LOCALE,
      fullFetchRequest.startPage,
      process.env.TAG
    );
    expect(transformDocuments).toHaveBeenCalledWith(contentfulDocuments);
    expect(indexIntoES).toHaveBeenCalledWith(esContentfulDocuments);
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    delete process.env.TAG;
  });
});
