import { Request, Response } from "express";
import { protos } from "@google-cloud/monitoring";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import {
  mockRequest as fetchMockRequest,
  mockResponse,
  mockResponses
} from "@bmi/fetch-mocks";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const mockRequest = (): Partial<Request> => fetchMockRequest("POST");

const listTimeSeries = jest.fn();
jest.mock("@google-cloud/monitoring", () => {
  const mMetricServiceClient = jest.fn(() => ({
    listTimeSeries: (
      request: protos.google.monitoring.v3.IListTimeSeriesRequest
    ): Promise<
      [
        protos.google.monitoring.v3.ITimeSeries[],
        protos.google.monitoring.v3.IListTimeSeriesRequest | null,
        protos.google.monitoring.v3.IListTimeSeriesResponse
      ]
    > => listTimeSeries(request)
  }));
  return { MetricServiceClient: mMetricServiceClient };
});

const build = (request: Partial<Request>, response: Partial<Response>) =>
  require("../index").build(request, response);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Invalid environment variables", () => {
  it("should return 500 if GCP_MONITOR_PROJECT is not set", async () => {
    const gcpMonitorProject = process.env.GCP_MONITOR_PROJECT;
    delete process.env.GCP_MONITOR_PROJECT;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.GCP_MONITOR_PROJECT = gcpMonitorProject;
  });

  it("should return 500 if GCP_APPLICATION_PROJECT is not set", async () => {
    const gcpApplicationProject = process.env.GCP_APPLICATION_PROJECT;
    delete process.env.GCP_APPLICATION_PROJECT;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.GCP_APPLICATION_PROJECT = gcpApplicationProject;
  });

  it("should return 500 if DXB_FIRESTORE_HANDLER_FUNCTION is not set", async () => {
    const dxbFirestoreHandlerFunction =
      process.env.DXB_FIRESTORE_HANDLER_FUNCTION;
    delete process.env.DXB_FIRESTORE_HANDLER_FUNCTION;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DXB_FIRESTORE_HANDLER_FUNCTION = dxbFirestoreHandlerFunction;
  });

  it("should return 500 if DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID is not set", async () => {
    const dxbFirestoreHandlerSubscriptionId =
      process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID;
    delete process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID =
      dxbFirestoreHandlerSubscriptionId;
  });

  it("should return 500 if NETLIFY_BUILD_HOOK is not set", async () => {
    const netlifyBuildHook = process.env.NETLIFY_BUILD_HOOK;
    delete process.env.NETLIFY_BUILD_HOOK;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.NETLIFY_BUILD_HOOK = netlifyBuildHook;
  });

  it("should return 500 if TIMEOUT_LIMIT is not set", async () => {
    const timeoutLimit = process.env.TIMEOUT_LIMIT;
    delete process.env.TIMEOUT_LIMIT;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.TIMEOUT_LIMIT = timeoutLimit;
  });

  it("should return 500 if TIMEOUT_LIMIT is not set as a valid number", async () => {
    const timeoutLimit = process.env.TIMEOUT_LIMIT;
    process.env.TIMEOUT_LIMIT = "a";

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.TIMEOUT_LIMIT = timeoutLimit;
  });

  it("should return 500 if DELAY_SECONDS is not set", async () => {
    const delaySeconds = process.env.DELAY_SECONDS;
    delete process.env.DELAY_SECONDS;

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DELAY_SECONDS = delaySeconds;
  });

  it("should return 500 if DELAY_SECONDS is not set as a valid number", async () => {
    const delaySeconds = process.env.DELAY_SECONDS;
    process.env.DELAY_SECONDS = "a";

    const res = mockResponse();

    await build(mockRequest(), res);

    expect(listTimeSeries).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.DELAY_SECONDS = delaySeconds;
  });
});

const populatedResponse = [[{}], {}, {}];
const emptyResponse = [[], {}, {}];
describe("Making a POST request", () => {
  it("returns status code 304 when no documents have been updated or deleted", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries.mockResolvedValue(emptyResponse);

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(304);

    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
  });

  it("returns status code 200 when documents were deleted, functions are not running and no more messages are being sent", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse);

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 200 when documents were updated, functions are not running and no more messages are being sent", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse);

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 200 when documents have been deleted or updated, functions are not running and no more messages are being sent, but webhook returns error code", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse);

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST",
      status: 500
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectMonitorCheck(
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 200 after waiting for functions to be finished when documents have been deleted or updated and no more messages are being sent", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse);

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expectNthMonitorCheck(
      1,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectNthMonitorCheck(
      2,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectNthMonitorCheck(
      3,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      4,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      5,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      6,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 200 after waiting for messages to be sent when documents have been deleted or updated and functions are finished", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(emptyResponse);

    mockResponses(fetchMock, {
      url: process.env.NETLIFY_BUILD_HOOK,
      method: "POST"
    });

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(200);

    expectNthMonitorCheck(
      1,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectNthMonitorCheck(
      2,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectNthMonitorCheck(
      3,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      4,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      5,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      6,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveFetched(process.env.NETLIFY_BUILD_HOOK, {
      method: "POST"
    });
  });

  it("returns status code 500 if functions never stop beyond timout when documents have been deleted or updated and no more messages are being sent", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse);

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(500);

    expectNthMonitorCheck(
      1,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectNthMonitorCheck(
      2,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectNthMonitorCheck(
      3,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      4,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      5,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      6,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      7,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      8,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      9,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      10,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveBeenCalledTimes(0);
  });

  it("returns status code 500 if messages never stop being sent beyond timout when documents have been deleted or updated and functions are finished", async () => {
    const req = mockRequest();
    const res = mockResponse();

    listTimeSeries
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse)
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(populatedResponse);

    await build(req, res);

    expect(res.sendStatus).toBeCalledWith(500);

    expectNthMonitorCheck(
      1,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
    );
    expectNthMonitorCheck(
      2,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
    );
    expectNthMonitorCheck(
      3,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      4,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      5,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      6,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      7,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      8,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expectNthMonitorCheck(
      9,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${process.env.DXB_FIRESTORE_HANDLER_FUNCTION}"`
    );
    expectNthMonitorCheck(
      10,
      `project = "${process.env.GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
    );
    expect(fetchMock).toHaveBeenCalledTimes(0);
  });
});

const expectMonitorCheck = (filter: string) => {
  expect(listTimeSeries).toHaveBeenCalledWith({
    name: `projects/${process.env.GCP_MONITOR_PROJECT}`,
    filter,
    interval: {
      endTime: { seconds: expect.any(Number) },
      startTime: { seconds: expect.any(Number) }
    },
    view: "HEADERS"
  });
};

const expectNthMonitorCheck = (n: number, filter: string) => {
  expect(listTimeSeries).toHaveBeenNthCalledWith(n, {
    name: `projects/${process.env.GCP_MONITOR_PROJECT}`,
    filter,
    interval: {
      endTime: { seconds: expect.any(Number) },
      startTime: { seconds: expect.any(Number) }
    },
    view: "HEADERS"
  });
};