import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import * as mockContentfulWebhook from "./resources/contentfulWebhook.json";

const FindBuildWebhook = jest.fn();
jest.mock("../find", () => {
  return { FindBuildWebhook };
});

FindBuildWebhook.mockReturnValue("https://norway.local/abcd");

const REQUEST_SECRET = "some secret";
const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const getSecret = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});
getSecret.mockReturnValue(REQUEST_SECRET);

const build = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).build(req as Request, res as Response);

describe("Error responses", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });
  it("Return error, when preivew is set but preview build webhooks are not set", async () => {
    const previewBuildWebhooks = process.env.PREVIEW_BUILD_WEBHOOKS;
    const IsPreview = process.env.PREVIEW_BUILD;
    delete process.env.PREVIEW_BUILD_WEBHOOKS;
    process.env.PREVIEW_BUILD = "true";

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.PREVIEW_BUILD_WEBHOOKS = previewBuildWebhooks;
    process.env.PREVIEW_BUILD = IsPreview;
  });

  it("Return error, when preivew is not set and build webhooks are not set", async () => {
    const buildWebhooks = process.env.BUILD_WEBHOOKS;
    const IsPreview = process.env.PREVIEW_BUILD;
    delete process.env.PREVIEW_BUILD;
    delete process.env.BUILD_WEBHOOKS;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.BUILD_WEBHOOKS = buildWebhooks;
    process.env.PREVIEW_BUILD = IsPreview;
  });

  it("Returns 500 when request secret is not provided", async () => {
    const buildRequestSecret = process.env.BUILD_REQUEST_SECRET;
    delete process.env.BUILD_REQUEST_SECRET;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.BUILD_REQUEST_SECRET = buildRequestSecret;
  });

  it("Returns 401 when authorisation header is empty", async () => {
    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when 'Bearer ' string is missing", async () => {
    const mockReq = mockRequest("POST", { authorization: "some value" });
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is missing", async () => {
    getSecret.mockReturnValueOnce("");
    const mockReq = mockRequest("POST", { authorization: "Bearer " });
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    getSecret.mockReturnValueOnce(shortSecret);
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${shortSecret}`
    });
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it.each([
    "GET",
    "HEAD",
    "PUT",
    "DELETE",
    "CONNECT",
    "OPTIONS",
    "TRACE",
    "PATCH"
  ])("Returns 405, when request method is %s", async (method) => {
    const mockReq = mockRequest(method);
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(405);
  });
  it.each([null, undefined])(
    "Returns 404, wwhen build webhook is %s",
    async (param) => {
      const mockReq = mockRequest("POST", {
        authorization: `Bearer ${REQUEST_SECRET}`
      });
      const mockRes = mockResponse();
      FindBuildWebhook.mockReturnValueOnce(param);

      await build(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(404);
    }
  );
});

describe("Making a POST request", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("Calls gatbsy cloud build, if called with a recognised tag, ", async () => {
    const req = mockRequest(
      "POST",
      { authorization: `Bearer ${REQUEST_SECRET}` },
      "https://someurl.local",
      mockContentfulWebhook
    );
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `*`,
      method: "POST",
      status: 200
    });

    await build(req, res);

    expect(fetchMock).toBeCalledTimes(1);
  });

  it("sends original request body to the POST request", async () => {
    const reqHeaders = { authorization: `Bearer ${REQUEST_SECRET}` };
    const req = mockRequest(
      "POST",
      reqHeaders,
      "https://someurl.local",
      mockContentfulWebhook
    );
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `*`,
      method: "POST",
      status: 200
    });

    await build(req, res);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toBeCalledWith("https://norway.local/abcd", {
      method: "POST",
      body: mockContentfulWebhook,
      headers: reqHeaders
    });
  });

  it("sends original request headers to the POST request", async () => {
    const requestHeaders = {
      "x-some-header-1": "some header value",
      "x-some-header-2": "some header value 2",
      authorization: `Bearer ${REQUEST_SECRET}`
    };
    const req = mockRequest(
      "POST",
      requestHeaders,
      "https://someurl.local",
      mockContentfulWebhook
    );
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `*`,
      method: "POST",
      status: 200
    });

    await build(req, res);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toBeCalledWith("https://norway.local/abcd", {
      method: "POST",
      body: mockContentfulWebhook,
      headers: requestHeaders
    });
  });
});
