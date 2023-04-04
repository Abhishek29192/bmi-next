import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";

const handleRequest = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).buildStatusLogger(req as Request, res as Response);

const mockGetFirestore = jest.fn();
jest.mock("@bmi/functions-firestore", () => {
  return {
    getFirestore: (...args: any[]) => {
      return { getFirestore: mockGetFirestore(...args), settings: jest.fn() };
    }
  };
});
const mockSaveBuildStatus = jest.fn();
const mockGetList = jest.fn();
jest.mock("../db", () => ({
  saveBuildStatus: (...args: any[]) => mockSaveBuildStatus(...args),
  getList: (...args: any[]) => mockGetList(...args)
}));

jest.useFakeTimers().setSystemTime(new Date("10/10/2022"));

jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 9, 10, 0, 0, 0)));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("buildStatusLogger", () => {
  it("should return 500 if BUILD_TRIGGER_ENDPOINT is not set", async () => {
    const originalValue = process.env.FIRESTORE_BUILD_STATUS_COLLECTION;
    delete process.env.FIRESTORE_BUILD_STATUS_COLLECTION;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.FIRESTORE_BUILD_STATUS_COLLECTION = originalValue;
  });

  it("should return 500 if FIRESTORE_TRIGGERED_BUILDS_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION;
    delete process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION = originalValue;
  });

  it("should return 500 if BEARER_TOKEN_SECRET is not set", async () => {
    const originalValue = process.env.BEARER_TOKEN_SECRET;
    delete process.env.BEARER_TOKEN_SECRET;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.BEARER_TOKEN_SECRET = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest({ method: "OPTIONS", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("should write build triggered event to firestore", async () => {
    const req = mockRequest({
      method: "POST",
      headers: { "x-contentful-webhook-name": "webhookName" },
      url: "/",
      body: {
        sys: {
          updatedBy: { sys: { id: "userID" } },
          updatedAt: "2022-10-11T00:00:00.000Z"
        }
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      event: "BUILD TRIGGERED",
      timestamp: 1665446400000,
      userId: "userID"
    });
  });

  it("should write build status event to firestore", async () => {
    const req = mockRequest({
      method: "POST",
      headers: {},
      url: "/",
      body: {
        body: "some body",
        event: "BUILD_SUCCEEDED"
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      event: "BUILD SUCCEEDED",
      timestamp: 1665360000000,
      body: "some body",
      isError: false
    });
  });

  it("should return unauthorized status if token is invalid", async () => {
    const req = mockRequest({
      method: "GET",
      headers: { authorization: "Bearer someRandomTOken" },
      url: "/"
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Please provide a valid access token."
    });
  });

  it("should return last build status events and build trigger events", async () => {
    const req = mockRequest({
      method: "GET",
      headers: { authorization: "Bearer bearerToken" },
      url: "/"
    });
    const mockedData = [
      {
        event: "BUILD SUCCEEDED",
        timestamp: "10/10/2022, 12:00:00 AM",
        body: "some body",
        isError: false
      }
    ];
    mockGetList.mockResolvedValueOnce(mockedData);
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockedData);
  });

  it("should return last build status events and build trigger events if Authorization is started from upper case", async () => {
    const req = mockRequest({
      method: "GET",
      headers: { Authorization: "Bearer bearerToken" },
      url: "/"
    });
    const mockedData = [
      {
        event: "BUILD SUCCEEDED",
        timestamp: "10/10/2022, 12:00:00 AM",
        body: "some body",
        isError: false
      }
    ];
    mockGetList.mockResolvedValueOnce(mockedData);
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockedData);
  });

  it("should return a HTTP_500_INTERNAL_SERVER_ERROR if some error happened", async () => {
    const req = mockRequest({
      method: "GET",
      headers: { Authorization: "Bearer bearerToken" },
      url: "/"
    });
    mockGetList.mockRejectedValueOnce(new Error("Internal server error"));
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong, try again later."
    });
  });
});
