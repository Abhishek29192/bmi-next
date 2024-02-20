/* eslint-disable security/detect-object-injection */
import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import type {
  Request,
  Response
} from "@google-cloud/functions-framework/build/src/functions";

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock as typeof fetch;
//needed for fetchRetry
jest.mock("node-fetch", () => fetchMock);

const deleteByQueryMock = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: () => ({
    deleteByQuery: deleteByQueryMock
  })
}));

const systemDate = new Date("2024-02-15T10:45:52.840Z");
beforeEach(() => {
  fetchMock.reset();
  jest.useFakeTimers();
  jest.setSystemTime(systemDate);
});

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const metadataUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`;
const gcpAuthToken = "gcp-auth-token";

const handleRequest = async (request: Request, response: Response) =>
  (await import("../index")).handleRequest(request, response);

describe("handleRequest", () => {
  it.each([
    "BEARER_TOKEN",
    "BUILD_TRIGGER_ENDPOINT",
    "ES_APIKEY",
    "ES_CLOUD_ID",
    "ES_INDEX_NAME_TRAININGS"
  ])("returns 500 if %s is not set", async (envVariableName) => {
    const original = process.env[envVariableName];
    delete process.env[envVariableName];

    const res = mockResponse();
    const req = mockRequest({});
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `${envVariableName} was not provided`
    });
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    process.env[envVariableName] = original;
  });

  it("returns 403 status code if auth token is not correct", async () => {
    const originalBearerToken = process.env.BEARER_TOKEN;
    process.env.BEARER_TOKEN = "expected-bearer-token";

    const res = mockResponse();
    const req = mockRequest({
      headers: { authorization: "Bearer fake-auth-token" }
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    process.env.BEARER_TOKEN = originalBearerToken;
  });

  it("triggers a new build if sessions have been deleted", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );
    deleteByQueryMock.mockResolvedValue({ body: { deleted: 10 } });

    const res = mockResponse();
    const req = mockRequest({
      headers: { authorization: `Bearer ${process.env.BEARER_TOKEN}` }
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          range: {
            startDate: {
              lte: systemDate.getTime()
            }
          }
        }
      }
    });
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
  });

  it("should not trigger a new build if sessions have not been deleted", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );
    deleteByQueryMock.mockResolvedValue({ body: { deleted: 0 } });

    const res = mockResponse();
    const req = mockRequest({
      headers: { authorization: `Bearer ${process.env.BEARER_TOKEN}` }
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          range: {
            startDate: {
              lte: systemDate.getTime()
            }
          }
        }
      }
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 if 'deleteByQuery' throws an error", async () => {
    deleteByQueryMock.mockRejectedValue(new Error("Expected error"));
    const res = mockResponse();
    const req = mockRequest({
      headers: { authorization: `Bearer ${process.env.BEARER_TOKEN}` }
    });

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
