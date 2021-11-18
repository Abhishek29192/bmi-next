import mockConsole from "jest-mock-console";
import { Request, Response } from "express";
import {
  mockRequest,
  mockResponse
} from "../../../../../../libraries/fetch-mocks/src/index";
import { handleRequest as realHandleRequest } from "..";
import { createFullFetchRequest } from "./helpers/fullFetchHelper";
import { createProductsApiResponse } from "./helpers/pimHelper";

const fetchData = jest.fn();
jest.mock("../pim", () => {
  const pim = jest.requireActual("../pim");
  return {
    ...pim,
    fetchData: (...args: any) => fetchData(...args)
  };
});

const publish = jest.fn();
jest.mock("@google-cloud/pubsub", () => {
  const mPubSub = jest.fn(() => ({
    topic: (...args: any) => ({
      publish: (...args: any) => publish(...args)
    })
  }));
  return { PubSub: mPubSub };
});

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const handleRequest = (
  request: Partial<Request>,
  response: Partial<Response>
) => realHandleRequest(request as Request, response as Response);

describe("handleRequest", () => {
  it("should return 400 if body is not provided", async () => {
    const request = mockRequest("POST");
    const response = mockResponse();

    await handleRequest(request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith({
      error: "type, startPage and numberOfPages was not provided."
    });
    expect(fetchData).not.toHaveBeenCalled();
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
      expect(error.message).toEqual("Expected error");
    }

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      fullFetchRequest.startPage
    );
  });

  it("should error when publishing data to pub/sub throws error", async () => {
    const productsApiResponse = createProductsApiResponse();
    fetchData.mockReturnValue(productsApiResponse);
    publish.mockRejectedValue(Error("Expected error"));
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    try {
      await handleRequest(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      fullFetchRequest.startPage
    );
    expect(publish).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: fullFetchRequest.type.toUpperCase(),
          items: productsApiResponse.products
        })
      )
    );
  });

  it("should publish data to pub/sub", async () => {
    const productsApiResponse = createProductsApiResponse();
    fetchData.mockReturnValue(productsApiResponse);
    const fullFetchRequest = createFullFetchRequest();
    const request = mockRequest("POST", {}, "", fullFetchRequest);
    const response = mockResponse();

    await handleRequest(request, response);

    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      fullFetchRequest.startPage
    );
    expect(publish).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: fullFetchRequest.type.toUpperCase(),
          items: productsApiResponse.products
        })
      )
    );
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should publish data from multiple pages to pub/sub", async () => {
    const productsApiResponse1 = createProductsApiResponse({
      products: [{ id: 1 }]
    });
    const productsApiResponse2 = createProductsApiResponse({
      products: [{ id: 2 }]
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
      fullFetchRequest.startPage
    );
    expect(fetchData).toHaveBeenCalledWith(
      fullFetchRequest.type,
      fullFetchRequest.startPage + 1
    );
    expect(publish).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: fullFetchRequest.type.toUpperCase(),
          items: productsApiResponse1.products
        })
      )
    );
    expect(publish).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: fullFetchRequest.type.toUpperCase(),
          items: productsApiResponse2.products
        })
      )
    );
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });
});
