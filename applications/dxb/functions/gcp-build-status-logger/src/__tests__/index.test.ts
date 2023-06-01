import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import { Status } from "simple-http-status";
import { GatsbyLog, BuildStatusType } from "../types";

const createGatsbyBuildLog = (log: Partial<GatsbyLog> = {}): GatsbyLog => ({
  body: "build body",
  buildId: "fake-build-id",
  workspaceName: "fake-workspace-name",
  siteName: "dxb-qa",
  deployPreviewUrl: "https://fake-deploy-preview-url",
  logsUrl: "https://fake-logs-url",
  duration: "433",
  resourceId: "fake-resource-id",
  resourceType: "SITE",
  event: BuildStatusType.BUILD_SUCCEEDED,
  ...log
});

const handleRequest = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).buildStatusLogger(req as Request, res as Response);

const setDocumentMock = jest.fn();
const accessDocumentMock = jest.fn();
const mockGetFirestore = jest.fn().mockReturnValue({
  doc: accessDocumentMock.mockReturnValue({ set: setDocumentMock })
});
jest.mock("@bmi/functions-firestore", () => {
  return {
    getFirestore: mockGetFirestore
  };
});

jest.useFakeTimers().setSystemTime(new Date("10/10/2022"));

jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 9, 10, 0, 0, 0)));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("buildStatusLogger", () => {
  it("should return 500 if GCP_PROJECT_ID is not set", async () => {
    const originalValue = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const req = mockRequest({ method: "POST", url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    process.env.GCP_PROJECT_ID = originalValue;
  });

  it("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const req = mockRequest({ method: "POST", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    process.env.FIRESTORE_ROOT_COLLECTION = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest({ method: "OPTIONS", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(Status.HTTP_204_NO_CONTENT);
  });

  it("should return 400 if 'event' field does not exist", async () => {
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: createGatsbyBuildLog({
        event: undefined
      })
    });

    const res = mockResponse();
    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      "Fields 'event', 'body', and 'buildId' are required"
    );
  });

  it("should return 400 if 'body' field does not exist", async () => {
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: createGatsbyBuildLog({
        body: undefined
      })
    });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      "Fields 'event', 'body', and 'buildId' are required"
    );
  });

  it("should return 400 if 'buildId' field does not exist", async () => {
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: createGatsbyBuildLog({
        buildId: undefined
      })
    });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      "Fields 'event', 'body', and 'buildId' are required"
    );
  });

  it("should write build event to firestore correctly", async () => {
    const buildLog = createGatsbyBuildLog();
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: buildLog
    });
    const res = mockResponse();

    await handleRequest(req, res);
    const expectedLog = {
      eventType: buildLog.event,
      timestamp: 1665360000000,
      body: buildLog.body,
      buildId: buildLog.buildId
    };
    expect(accessDocumentMock).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/production/${buildLog.buildId}`
    );
    expect(setDocumentMock).toHaveBeenCalledWith(expectedLog);
    expect(res.status).toHaveBeenCalledWith(Status.HTTP_201_CREATED);
    expect(res.send).toHaveBeenCalledWith(expectedLog);
  });

  it("should write preview event to firestore correctly", async () => {
    const previewLog = createGatsbyBuildLog({
      event: BuildStatusType.PREVIEW_SUCCEEDED
    });
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: previewLog
    });
    const res = mockResponse();

    await handleRequest(req, res);

    const expectedLog = {
      eventType: previewLog.event,
      timestamp: 1665360000000,
      body: previewLog.body,
      buildId: previewLog.buildId
    };
    expect(accessDocumentMock).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/preview/${previewLog.buildId}`
    );
    expect(setDocumentMock).toHaveBeenCalledWith(expectedLog);
    expect(res.status).toHaveBeenCalledWith(Status.HTTP_201_CREATED);
    expect(res.send).toHaveBeenCalledWith(expectedLog);
  });

  it("should return 500 status code if an error occurs", async () => {
    const gatsbyLog = createGatsbyBuildLog();
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: gatsbyLog
    });
    setDocumentMock.mockRejectedValueOnce(new Error("Internal server error"));
    const res = mockResponse();
    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong, try again later."
    });
  });
});
