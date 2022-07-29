import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import type { RequestInfo, RequestInit, Response } from "node-fetch";
import type { RetryOptions } from "../types";

const fetchMock = fetchMockJest.sandbox();

jest.mock("node-fetch", () => fetchMock);

const fetchRetry = async (
  url: RequestInfo,
  body?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> =>
  (await import("../index")).default(url, body, retryOptions);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("fetchRetry", () => {
  it("should throw error thrown by fetch", async () => {});
  it("should return error when request returns a non-retryable status code", async () => {
    mockResponses(fetchMock, {
      url: "https://localhost:8000",
      method: "GET",
      status: 500
    });

    try {
      await fetchRetry("https://localhost:8000");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Failed request for "https://localhost:8000" after 1 retries with the following errors: ["Internal Server Error - "]'
      );
    }
    expect(fetchMock).toHaveFetched("https://localhost:8000");
    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it("should retry and then return error when request returns a retryable status code", async () => {
    mockResponses(fetchMock, {
      url: "https://localhost:8000",
      method: "GET",
      status: 429
    });

    try {
      await fetchRetry("https://localhost:8000", undefined, {
        retryableStatusCodes: [429]
      });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Failed request for "https://localhost:8000" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]'
      );
    }
    expect(fetchMock).toHaveFetched("https://localhost:8000");
    expect(fetchMock).toHaveFetchedTimes(5);
  });

  it("should allow multiple retryable status codes", async () => {
    mockResponses(fetchMock, {
      url: "https://localhost:8000",
      method: "GET",
      status: 408
    });

    try {
      await fetchRetry("https://localhost:8000", undefined, {
        retryableStatusCodes: [429, 408]
      });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Failed request for "https://localhost:8000" after 5 retries with the following errors: ["Request Timeout - ","Request Timeout - ","Request Timeout - ","Request Timeout - ","Request Timeout - "]'
      );
    }
    expect(fetchMock).toHaveFetched("https://localhost:8000");
    expect(fetchMock).toHaveFetchedTimes(5);
  });

  it("should retry the number of times configured", async () => {
    mockResponses(fetchMock, {
      url: "https://localhost:8000",
      method: "GET",
      status: 429
    });

    try {
      await fetchRetry("https://localhost:8000", undefined, {
        maxRetries: 2,
        retryableStatusCodes: [429]
      });
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Failed request for "https://localhost:8000" after 2 retries with the following errors: ["Too Many Requests - ","Too Many Requests - "]'
      );
    }
    expect(fetchMock).toHaveFetched("https://localhost:8000");
    expect(fetchMock).toHaveFetchedTimes(2);
  });

  it("should return response when request returns an ok status code", async () => {
    mockResponses(fetchMock, {
      url: "https://localhost:8000",
      method: "GET",
      status: 200,
      body: { value: "returned" }
    });

    const response = await fetchRetry("https://localhost:8000");
    expect(response.ok).toBeTruthy();
    expect(await response.json()).toEqual({ value: "returned" });
    expect(fetchMock).toHaveFetched("https://localhost:8000");
    expect(fetchMock).toHaveFetchedTimes(1);
  });
});
