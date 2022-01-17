import { Readable } from "stream";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { v4 as uuid } from "uuid";
import {
  MockedResponse,
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi/fetch-mocks";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const proxy = async (request: Partial<Request>, response: Partial<Response>) =>
  (await import("../index")).proxy(request as Request, response as Response);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET,POST");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Headers", [
      "Content-Type",
      "authorization"
    ]);
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
  });
});

describe("Making a PUT request", () => {
  it("returns status code 400", async () => {
    const req: Partial<Request> = {
      method: "PUT"
    };
    const res = mockResponse();

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      '{"error":"PUT request method is not supported. Use GET or POST."}'
    );
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
  });
});

describe("Making a DELETE request", () => {
  it("returns status code 400", async () => {
    const req: Partial<Request> = {
      method: "DELETE"
    };
    const res = mockResponse();

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      '{"error":"DELETE request method is not supported. Use GET or POST."}'
    );
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
  });
});

describe("Making a GET request", () => {
  it("calls elasticsearch and returns error response if something goes wrong", async () => {
    const req = mockRequest(
      "GET",
      {
        accept: uuid(),
        "accept-encoding": uuid(),
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse: MockedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "GET",
      body: Readable.from(["Something went bang"]),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" },
      error: new Error("Something went bang!")
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith("Request to Elasticsearch failed.");
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!
      }
    });
  });

  it("calls elasticsearch and returns response", async () => {
    const req = mockRequest(
      "GET",
      {
        accept: uuid(),
        "accept-encoding": uuid(),
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse: MockedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "GET",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers!).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!
      }
    });
  });

  it("calls elasticsearch without headers and returns response", async () => {
    const req = mockRequest("GET", {}, "/some_index/_search", {});
    const res = mockResponse();

    const expectedResponse: MockedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "GET",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers!).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      method: req.method,
      headers: {}
    });
  });

  it("calls elasticsearch without compressed even if gzip encoding allowed and returns response", async () => {
    const req = mockRequest(
      "GET",
      {
        accept: uuid(),
        "accept-encoding": `gzip ${uuid()}`,
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "GET",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!
      }
    });
  });
});

describe("Making a POST request", () => {
  it("calls elasticsearch and returns error response if something goes wrong", async () => {
    const req = mockRequest(
      "POST",
      {
        accept: uuid(),
        "accept-encoding": uuid(),
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "POST",
      body: Readable.from(["Something went bang"]),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" },
      error: new Error("Something went bang!")
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith("Request to Elasticsearch failed.");
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      body: req.body,
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!,
        "content-length": req.headers!["content-length"]!,
        "content-type": req.headers!["content-type"]!
      }
    });
  });

  it("calls elasticsearch and returns response", async () => {
    const getRandomStatus = (): number => {
      const number = Math.floor(Math.random() * 500);
      if (number === 0) {
        return getRandomStatus();
      }
      return number;
    };

    const req = mockRequest(
      "POST",
      {
        accept: uuid(),
        "accept-encoding": uuid(),
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "POST",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: getRandomStatus(),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      body: req.body,
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!,
        "content-length": req.headers!["content-length"]!,
        "content-type": req.headers!["content-type"] as string
      }
    });
  });

  it("calls elasticsearch without headers and returns response", async () => {
    const req = mockRequest("POST", {}, "/some_index/_search", {});
    const res = mockResponse();

    const expectedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "POST",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      body: req.body,
      method: req.method,
      headers: {}
    });
  });

  it("calls elasticsearch with compressed even if gzip encoding allowed and returns response", async () => {
    const req = mockRequest(
      "POST",
      {
        accept: uuid(),
        "accept-encoding": `gzip ${uuid()}`,
        "accept-language": uuid(),
        authorization: uuid(),
        connection: uuid(),
        "content-length": uuid(),
        "content-type": uuid()
      },
      "/some_index/_search",
      {}
    );
    const res = mockResponse();

    const expectedResponse = {
      url: `${process.env.ES_HOST}${req.url}`,
      method: "POST",
      body: Readable.from(['{"size":0,"timeout":0}']),
      status: Math.floor(Math.random() * 500),
      headers: { "content-type": "application/json" }
    };
    mockResponses(fetchMock, expectedResponse);

    await proxy(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(expectedResponse.status);
    Object.entries(expectedResponse.headers).forEach(([key, value]) => {
      expect(res.setHeader).toBeCalledWith(key, value);
    });
    expect(res.on).toBeCalledWith("unpipe", expect.any(Function));
    expect(fetchMock).toHaveFetched(expectedResponse.url, {
      body: req.body,
      method: req.method,
      headers: {
        accept: req.headers!.accept!,
        "accept-encoding": req.headers!["accept-encoding"] as string,
        "accept-language": req.headers!["accept-language"]!,
        authorization: req.headers!.authorization!,
        connection: req.headers!.connection!,
        "content-length": req.headers!["content-length"]!,
        "content-type": req.headers!["content-type"]!
      }
    });
  });
});
