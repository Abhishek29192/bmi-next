import {
  mockRequest as fetchMockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const mockRequest = (): Partial<Request> => fetchMockRequest("POST");

const build = async (request: Partial<Request>, response: Partial<Response>) =>
  (await import("../index")).build(request as Request, response as Response);

beforeAll(() => {
  // mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  process.env.DELAY_MILLISECONDS = "0";
});

describe("Invalid environment variables", () => {
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

    delete process.env.METRIC_LATENCY_DELAY;
  });
});
