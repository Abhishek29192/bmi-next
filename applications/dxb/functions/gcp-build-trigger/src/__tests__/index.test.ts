import {
  mockRequest as fetchMockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";

const swapReadWriteAliases = jest.fn();
jest.mock("../elasticsearch", () => {
  // Throws "ReferenceError: setImmediate is not defined" with jest.requireActual
  enum ElasticsearchIndexes {
    Products = "products",
    Systems = "systems"
  }
  return {
    ElasticsearchIndexes: ElasticsearchIndexes,
    swapReadWriteAliases: (aliasPrefix: string) =>
      swapReadWriteAliases(aliasPrefix)
  };
});

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const mockRequest = (): Partial<Request> =>
  fetchMockRequest({ method: "POST" });

const build = async (request: Partial<Request>, response: Partial<Response>) =>
  (await import("../index")).build(request as Request, response as Response);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  process.env.DELAY_MILLISECONDS = "0";
});

describe("Invalid environment variables", () => {
  it("should return 500 if ES_INDEX_NAME_DOCUMENTS is not set", async () => {
    const esIndexDocuments = process.env.ES_INDEX_NAME_DOCUMENTS;
    delete process.env.ES_INDEX_NAME_DOCUMENTS;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(res.sendStatus).toBeCalledWith(500);

    process.env.ES_INDEX_NAME_DOCUMENTS = esIndexDocuments;
  });

  it("should return 500 if ES_INDEX_PREFIX is not set", async () => {
    const esIndexPrefix = process.env.ES_INDEX_PREFIX;
    delete process.env.ES_INDEX_PREFIX;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(res.sendStatus).toBeCalledWith(500);

    process.env.ES_INDEX_PREFIX = esIndexPrefix;
  });

  it("should return 500 if NETLIFY_BUILD_HOOK is not set", async () => {
    const netlifyBuildHook = process.env.NETLIFY_BUILD_HOOK;
    delete process.env.NETLIFY_BUILD_HOOK;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(res.sendStatus).toBeCalledWith(500);

    process.env.NETLIFY_BUILD_HOOK = netlifyBuildHook;
  });

  it("should return 500 if DELAY_MILLISECONDS is not set", async () => {
    const delaySeconds = process.env.DELAY_MILLISECONDS;
    delete process.env.DELAY_MILLISECONDS;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DELAY_MILLISECONDS = delaySeconds;
  });

  it("should return 500 if DELAY_MILLISECONDS is not set as a valid number", async () => {
    const delaySeconds = process.env.DELAY_MILLISECONDS;
    process.env.DELAY_MILLISECONDS = "a";

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DELAY_MILLISECONDS = delaySeconds;
  });
});

describe("Making a POST request", () => {
  it("throw error if build hook trigger fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST",
      error: new Error("Expected error")
    });

    try {
      await build(req, res);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(res.sendStatus).not.toBeCalled();
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 200 when build hook is triggered successfully", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
    // `ES_INDEX_PREFIX` and `ES_INDEX_NAME_DOCUMENTS` are globally setup for testing
    // see `jest/src/setEnvVars.ts`
    expect(swapReadWriteAliases).toBeCalledTimes(3);
  });

  it("waits for the DELAY_MILLISECONDS milliseconds before making any requests", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    const withoutDelayStart = new Date();
    await build(req, res);
    const withoutDelayDifference =
      new Date().getTime() - withoutDelayStart.getTime();

    jest.resetModules();

    process.env.DELAY_MILLISECONDS = "1000";
    const withDelayStart = new Date();
    await build(req, res);
    const withDelayDifference = new Date().getTime() - withDelayStart.getTime();
    expect(withDelayDifference - withoutDelayDifference).toBeGreaterThanOrEqual(
      900 // Allow for deviation in run time
    );

    expect(res.sendStatus).toBeCalledWith(200);
    expect(fetchMock).toHaveFetchedTimes(2, process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });

    // `ES_INDEX_PREFIX` and `ES_INDEX_NAME_DOCUMENTS` are globally setup for testing
    // see `jest/src/setEnvVars.ts`
    expect(swapReadWriteAliases).toBeCalledTimes(6);
    delete process.env.METRIC_LATENCY_DELAY;
  });
});
