import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import { GatsbyLog, BuildStatusType } from "../types";

const createGatsbyBuildLog = (log: Partial<GatsbyLog> = {}): GatsbyLog => ({
  body: "build body",
  buildId: "fake-build-id",
  workspaceName: "fake-workspace-name",
  siteName: "dxb-qa",
  deployPreviewUrl: "https://fake-deploy-preview-url/",
  logsUrl: "https://fake-logs-url",
  duration: "433",
  resourceId: "fake-resource-id",
  resourceType: "SITE",
  event: BuildStatusType.BUILD_SUCCEEDED,
  ...log
});

const handleRequest = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).buildStatusLogger(req as Request, res as Response);

const getBuildStartedEventIdMock = jest.fn();
const setDocumentInFirestoreMock = jest.fn();
jest.mock("../db", () => ({
  getBuildStartedEventId: getBuildStartedEventIdMock,
  setDocumentInFirestore: setDocumentInFirestoreMock
}));

jest.useFakeTimers().setSystemTime(new Date("10/10/2022"));
jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2022, 9, 10, 0, 0, 0)));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.GATSBY_SITE_URL = "https://fake-deploy-preview-url/";
});

describe("buildStatusLogger", () => {
  it("should return 500 if GCP_PROJECT_ID is not set", async () => {
    const originalValue = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const req = mockRequest({ method: "POST", url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.GCP_PROJECT_ID = originalValue;
  });

  it("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const req = mockRequest({ method: "POST", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.FIRESTORE_ROOT_COLLECTION = originalValue;
  });

  it("should return 500 if GATSBY_SITE_URL is not set", async () => {
    const originalValue = process.env.GATSBY_SITE_URL;
    delete process.env.GATSBY_SITE_URL;

    const req = mockRequest({ method: "POST", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.GATSBY_SITE_URL = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest({ method: "OPTIONS", headers: {}, url: "/" });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
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
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Fields 'event' and 'body' are required"
    );
  });

  it("should return 400 if 'deployPreviewUrl' field does match process.env.GATSBY_SITE_URL", async () => {
    process.env.GATSBY_SITE_URL = "https://fake-deploy-preview-url/";
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: createGatsbyBuildLog({
        event: undefined,
        deployPreviewUrl: "https://wrong-url"
      })
    });

    const res = mockResponse();
    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "'deployPreviewUrl' field is not correct"
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
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Fields 'event' and 'body' are required"
    );
  });

  it("updates BUILD_STARTED event if exists", async () => {
    getBuildStartedEventIdMock.mockResolvedValue("1665360000000");
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: createGatsbyBuildLog({
        event: BuildStatusType.BUILD_SUCCEEDED,
        body: "Succeeded",
        buildId: "build-id"
      })
    });

    const res = mockResponse();
    await handleRequest(req, res);
    expect(setDocumentInFirestoreMock).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/production/1665360000000`,
      {
        timestamp: 1665360000000,
        eventType: BuildStatusType.BUILD_SUCCEEDED,
        body: "Succeeded",
        buildId: "build-id"
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should create a new build event in firestore if getBuildStartedEventId returns undefined", async () => {
    getBuildStartedEventIdMock.mockResolvedValue(undefined);
    const buildLog = createGatsbyBuildLog({
      event: BuildStatusType.BUILD_STARTED
    });
    const req = mockRequest({ method: "POST", url: "/", body: buildLog });
    const res = mockResponse();

    await handleRequest(req, res);
    const expectedLog = {
      eventType: buildLog.event,
      timestamp: 1665360000000,
      body: buildLog.body,
      buildId: buildLog.buildId
    };

    expect(setDocumentInFirestoreMock).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/production/1665360000000`,
      expectedLog
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expectedLog);
  });

  it("should create a new preview event in firestore if getLatestStartedBuildId returns undefined", async () => {
    getBuildStartedEventIdMock.mockResolvedValue(undefined);
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

    expect(setDocumentInFirestoreMock).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/preview/1665360000000`,
      expectedLog
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expectedLog);
  });

  it("should return 500 status code if an error occurs", async () => {
    const gatsbyLog = createGatsbyBuildLog();
    const req = mockRequest({
      method: "POST",
      url: "/",
      body: gatsbyLog
    });
    setDocumentInFirestoreMock.mockRejectedValueOnce(
      new Error("Internal server error")
    );
    const res = mockResponse();
    await handleRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong, try again later."
    });
  });
});
