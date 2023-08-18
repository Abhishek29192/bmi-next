import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import { BuildLog } from "@bmi/firestore-types";

const handleRequest = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).getGatsbyBuildEvents(
    req as Request,
    res as Response
  );

const getDataMock = jest.fn().mockReturnValue({ docs: [] });
const limitMock = jest.fn().mockReturnValue({ get: getDataMock });
const orderByMock = jest.fn().mockReturnValue({ limit: limitMock });
const getCollectionMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
const mockGetFirestore = jest.fn().mockReturnValue({
  collection: getCollectionMock
});

jest.mock("@bmi/functions-firestore", () => {
  return {
    getFirestore: mockGetFirestore
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const buildsData: BuildLog[] = [
  {
    timestamp: 123456675,
    eventType: "BUILD_SUCCEEDED",
    body: "body1",
    buildId: "1"
  },
  {
    timestamp: 123456675,
    eventType: "BUILD_SUCCEEDED",
    body: "body2",
    buildId: "2"
  },
  {
    timestamp: 123456675,
    eventType: "BUILD_SUCCEEDED",
    body: "body3",
    buildId: "3"
  }
];

describe("getGatsbyBuildEvents", () => {
  it("should return 500 if GCP_PROJECT_ID is not set", async () => {
    const originalValue = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const req = mockRequest({ method: "GET", url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.GCP_PROJECT_ID = originalValue;
  });

  it("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.FIRESTORE_ROOT_COLLECTION = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest({ method: "OPTIONS", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("uses default limit if 'limit' query param does not exist in the url", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      query: { limit: undefined }
    });
    const res = mockResponse();
    await handleRequest(req, res);
    expect(limitMock).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("uses 'limit' from the query if provided", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      query: { limit: "10" }
    });
    const res = mockResponse();
    await handleRequest(req, res);
    expect(limitMock).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns data correctly", async () => {
    getDataMock
      .mockResolvedValueOnce({
        docs: [
          { data: jest.fn().mockReturnValue(buildsData[0]) },
          { data: jest.fn().mockReturnValue(buildsData[1]) },
          { data: jest.fn().mockReturnValue(buildsData[2]) }
        ]
      })
      .mockResolvedValueOnce({ docs: [] });

    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/"
    });
    const res = mockResponse();
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      buildEvents: buildsData,
      previewEvents: []
    });
  });

  it("returns 500 status code if an error occurs", async () => {
    getDataMock.mockRejectedValue({ message: "An error occured" });
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/"
    });
    const res = mockResponse();
    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
