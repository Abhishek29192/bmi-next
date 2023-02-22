import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { ClientAPI, Environment, Space } from "contentful-management";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import * as mockContentfulWebhook from "./resources/contentfulWebhook.json";

const getAsset = jest.fn().mockReturnValue(mockContentfulWebhook);
const getEntry = jest.fn().mockReturnValue(mockContentfulWebhook);
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.getEntry = getEntry;
  env.getAsset = getAsset;
  return env;
};
const getEnvironment = jest.fn().mockResolvedValue(mockEnvironment());
const mockSpace = (): Partial<Space> => {
  const space: Partial<Space> = {};
  space.getEnvironment = getEnvironment;
  return space;
};

const mockClient = (): Partial<ClientAPI> => {
  const client: Partial<ClientAPI> = {};
  client.getSpace = jest.fn().mockReturnValue(mockSpace());
  return client;
};
const createClient = jest.fn().mockReturnValue(mockClient());

jest.mock("contentful-management", () => {
  return {
    createClient
  };
});

const findBuildWebhooks = jest.fn();
jest.mock("../find", () => {
  return { findBuildWebhooks };
});

findBuildWebhooks.mockReturnValue(["https://norway.local/abcd"]);

const REQUEST_SECRET = "build_secret";
const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const build = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).build(req as Request, res as Response);

describe("Error responses", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockConsole();
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
  it("Return error, when CONTENTFUL_ENVIRONMENT is not set and build webhooks are not set", async () => {
    const contentfulEnviroment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = contentfulEnviroment;
  });

  it("Return error, when MANAGEMENT_ACCESS_TOKEN is not set and build webhooks are not set", async () => {
    const magementAccessToken = process.env.MANAGEMENT_ACCESS_TOKEN;
    delete process.env.MANAGEMENT_ACCESS_TOKEN;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.MANAGEMENT_ACCESS_TOKEN = magementAccessToken;
  });

  it("Returns 500 when request secret is not provided", async () => {
    const buildRequestSecret = process.env.BUILD_REQUEST;
    delete process.env.BUILD_REQUEST;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.BUILD_REQUEST = buildRequestSecret;
  });

  it("Returns 500 when management access token is not provided", async () => {
    const managementAccessToken = process.env.MANAGEMENT_ACCESS_TOKEN;
    delete process.env.MANAGEMENT_ACCESS_TOKEN;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.MANAGEMENT_ACCESS_TOKEN = managementAccessToken;
  });

  it("Returns 500 when contentful environment is not provided", async () => {
    const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = contentfulEnvironment;
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
    const mockReq = mockRequest("POST", { authorization: "Bearer " });
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${shortSecret}`
    });
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it.each(["GET", "HEAD", "PUT", "DELETE", "CONNECT", "TRACE", "PATCH"])(
    "Returns 405, when request method is %s",
    async (method) => {
      const mockReq = mockRequest(method);
      const mockRes = mockResponse();

      await build(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(405);
    }
  );

  it("Returns 500, when not found Entry/Asset by id", async () => {
    const mockReq = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      {
        ...mockContentfulWebhook,
        metadata: undefined
      }
    );
    const mockRes = mockResponse();

    await build(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(500);
  });

  it.each([null, undefined])(
    "Returns 404, when build webhook is %s",
    async (param) => {
      const mockReq = mockRequest(
        "POST",
        {
          authorization: `Bearer ${REQUEST_SECRET}`
        },
        undefined,
        mockContentfulWebhook
      );
      const mockRes = mockResponse();
      findBuildWebhooks.mockReturnValueOnce(param);

      await build(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(404);
    }
  );

  it("Returns 500, when either of build webhook fetches return an error", async () => {
    const mockReq = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      mockContentfulWebhook
    );
    const mockRes = mockResponse();

    mockResponses(fetchMock, {
      url: `https://one`,
      method: "POST",
      status: 500
    });

    mockResponses(fetchMock, {
      url: `https://two`,
      method: "POST",
      status: 200
    });
    findBuildWebhooks.mockReturnValueOnce(["https://one", "https://two"]);

    await build(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(500);
  });

  it("Returns 500, when build webhook fetch returns an error", async () => {
    const buildWebhook = "https://norway.local";
    const mockReq = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      mockContentfulWebhook
    );
    const mockRes = mockResponse();
    findBuildWebhooks.mockReturnValueOnce(buildWebhook);
    fetchMock.mock(buildWebhook, { throws: new Error("error") });

    await build(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(500);
  });
});

describe("Making an OPTIONS request", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockConsole();
  });

  it("Sends CORS headers", async () => {
    const req = mockRequest("OPTIONS");
    const res = mockResponse();

    await build(req, res);

    expect(res.set).toHaveBeenNthCalledWith(
      1,
      "Access-Control-Allow-Origin",
      "*"
    );
    expect(res.set).toHaveBeenNthCalledWith(
      2,
      "Access-Control-Allow-Methods",
      "POST,OPTIONS"
    );
    expect(res.set).toHaveBeenNthCalledWith(
      3,
      "Access-Control-Allow-Headers",
      "content-type,x-preview-auth-token,x-preview-update-source"
    );
  });

  it("Sends 204 response", async () => {
    const req = mockRequest("OPTIONS");
    const res = mockResponse();

    await build(req, res);

    expect(res.status).toBeCalledWith(204);
  });
});

describe("Making a POST request", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockConsole();
  });

  it("Sends 204 if preview and request body is empty", async () => {
    const IsPreview = process.env.PREVIEW_BUILD;
    const previewBuildWebhooks = process.env.PREVIEW_BUILD_WEBHOOKS;
    process.env.PREVIEW_BUILD = "true";
    process.env.PREVIEW_BUILD_WEBHOOKS = "true";
    const req = mockRequest("POST", undefined, undefined, "{}");
    const res = mockResponse();

    await build(req, res);

    expect(res.status).toBeCalledWith(204);
    process.env.PREVIEW_BUILD = IsPreview;
    process.env.PREVIEW_BUILD_WEBHOOKS = previewBuildWebhooks;
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

  it("Calls all gatbsy cloud build webhooks, if called with a recognised tag, ", async () => {
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

    findBuildWebhooks.mockReturnValueOnce([
      "https://webhook1",
      "https://webhook1"
    ]);

    await build(req, res);

    expect(fetchMock).toBeCalledTimes(2);
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
      body: JSON.stringify(mockContentfulWebhook),
      headers: expect.any(Object)
    });
  });

  it("sends contentful request headers to the POST request", async () => {
    const requestHeaders = {
      "x-some-header-1": "some header value",
      "x-some-header-2": "some header value 2",
      authorization: `Bearer ${REQUEST_SECRET}`,
      "x-contentful-topic": "some value1",
      "x-contentful-webhook-name": "some value 2",
      "content-type": "application/json"
    };
    const contentfulRequestHeaders = {
      "X-Contentful-Topic": "some value1",
      "X-Contentful-Webhook-Name": "some value 2",
      "Content-Type": "application/vnd.contentful.management.v1+json"
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
      body: JSON.stringify(mockContentfulWebhook),
      headers: contentfulRequestHeaders
    });
  });

  it("sends Entry when trigger unpublish event", async () => {
    const reqHeaders = { authorization: `Bearer ${REQUEST_SECRET}` };
    const requestBody = {
      ...mockContentfulWebhook,
      metadata: undefined,
      sys: {
        ...mockContentfulWebhook.sys,
        type: "DeletedEntry"
      }
    };
    const req = mockRequest(
      "POST",
      reqHeaders,
      "https://someurl.local",
      requestBody
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
      body: JSON.stringify(requestBody),
      headers: expect.any(Object)
    });
  });

  it("sends Asset when trigger unpublish event", async () => {
    const reqHeaders = { authorization: `Bearer ${REQUEST_SECRET}` };
    const requestBody = {
      ...mockContentfulWebhook,
      metadata: undefined,
      sys: {
        ...mockContentfulWebhook.sys,
        type: "DeletedAsset"
      }
    };
    const req = mockRequest(
      "POST",
      reqHeaders,
      "https://someurl.local",
      requestBody
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
      body: JSON.stringify(requestBody),
      headers: expect.any(Object)
    });
  });
});
