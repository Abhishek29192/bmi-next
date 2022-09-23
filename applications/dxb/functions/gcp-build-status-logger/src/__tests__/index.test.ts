import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import mockConsole from "jest-mock-console";

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

const date = new Date("10/10/2022").toDateString();

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("buildStatusLogger", () => {
  it("should return 500 if BUILD_TRIGGER_ENDPOINT is not set", async () => {
    const originalValue = process.env.FIRESTORE_BUILD_STATUS_COLLECTION;
    delete process.env.FIRESTORE_BUILD_STATUS_COLLECTION;

    const req = mockRequest("GET", {}, "/");
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.FIRESTORE_BUILD_STATUS_COLLECTION = originalValue;
  });

  it("should return 500 if FIRESTORE_TRIGGERED_BUILDS_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION;
    delete process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION;

    const req = mockRequest("GET", {}, "/");
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION = originalValue;
  });

  it("should return 500 if BEARER_TOKEN_SECRET is not set", async () => {
    const originalValue = process.env.BEARER_TOKEN_SECRET;
    delete process.env.BEARER_TOKEN_SECRET;

    const req = mockRequest("GET", {}, "/");
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.BEARER_TOKEN_SECRET = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest("OPTIONS", {}, "/");
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("should write build triggered event to firestore", async () => {
    const req = mockRequest(
      "POST",
      { "x-contentful-webhook-name": "webhookName" },
      "/",
      { sys: { updatedBy: { sys: { id: "userID" } }, updatedAt: date } }
    );
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      event: "BUILD TRIGGRED",
      timestamp: "10/10/2022, 12:00:00 AM",
      userId: "userID"
    });
  });

  it("should write build status event to firestore", async () => {
    const req = mockRequest("POST", {}, "/", {
      body: "some body",
      event: "BUILD_SUCCEDED"
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      event: "BUILD SUCCEDED",
      timestamp: "10/10/2022, 12:00:00 AM",
      body: "some body",
      isError: false
    });
  });

  it("should return unauthorized status if token is invalid", async () => {
    const req = mockRequest(
      "GET",
      { authorization: "Bearer someRandomTOken" },
      "/"
    );
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Please provide a valid access token."
    });
  });

  it("should return last build status events and build trigger events", async () => {
    const req = mockRequest(
      "GET",
      { authorization: "Bearer bearerToken" },
      "/"
    );
    const mockedData = [
      {
        event: "BUILD SUCCEDED",
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
    const req = mockRequest(
      "GET",
      { Authorization: "Bearer bearerToken" },
      "/"
    );
    const mockedData = [
      {
        event: "BUILD SUCCEDED",
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
    const req = mockRequest(
      "GET",
      { Authorization: "Bearer bearerToken" },
      "/"
    );
    mockGetList.mockRejectedValueOnce(new Error("Internal server error"));
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong, try again later."
    });
  });
});
