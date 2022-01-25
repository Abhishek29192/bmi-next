/* eslint-disable no-console */
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockRequest, mockResponse, mockResponses } from "@bmi/fetch-mocks";
import responses from "./responses.json";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const SECRET = "SOME_SECRET";
const CONTENTFUL_TOKEN = "SOME_TOKEN";

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));

  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const save = jest.fn();
const file = jest.fn().mockReturnValue({ save });
const bucket = jest.fn().mockReturnValue({ file });
jest.mock("@google-cloud/storage", () => {
  return {
    Storage: jest.fn(() => ({
      bucket
    }))
  };
});

let handleRequest: HttpFunction;

let oldEnv = process.env;

beforeAll(() => {
  oldEnv = process.env;
  mockConsole();
});

beforeEach(() => {
  process.env = {
    ...oldEnv,
    WEBTOOLS_UPDATE_REQUEST_SECRET: "WEBTOOLS_UPDATE_REQUEST_SECRET_VALUE",
    WEBTOOLS_CONTENTFUL_TOKEN_SECRET: "WEBTOOLS_CONTENTFUL_TOKEN_SECRET_VALUE",
    SECRET_MAN_GCP_PROJECT_NAME: "SECRET_MAN_GCP_PROJECT_NAME_VALUE",
    WEBTOOLS_CALCULATOR_BUCKET: "WEBTOOLS_CALCULATOR_BUCKET_VALUE",
    WEBTOOLS_CONTENTFUL_SPACE: "WEBTOOLS_CONTENTFUL_SPACE_VALUE",
    WEBTOOLS_CONTENTFUL_ENVIRONMENT: "WEBTOOLS_CONTENTFUL_ENVIRONMENT_VALUE"
  };

  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();

  accessSecretVersion.mockImplementation(({ name }) => {
    if (name.includes(process.env.WEBTOOLS_UPDATE_REQUEST_SECRET)) {
      return [{ payload: { data: SECRET } }];
    }
    if (name.includes(process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET)) {
      return [{ payload: { data: CONTENTFUL_TOKEN } }];
    }

    throw new Error("Unkown secret");
  });

  const index = require("../index");
  handleRequest = index.handleRequest;
});

afterAll(() => {
  process.env = oldEnv;
});

describe("Generating JSON file from WebTools space", () => {
  it("makes calls to Contentful and creates the transformed data file", async () => {
    responses.forEach(([body, { status }]) => {
      fetchMock.postOnce(() => true, {
        body: JSON.stringify(body),
        status,
        headers: {}
      });
    });

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect((console.warn as jest.Mock).mock.calls).toMatchSnapshot(
      "fetch & transform warnings"
    );

    expect(
      fetchMock
        .calls()
        .map(([url, result]) => [
          url,
          result ? { ...result, body: JSON.parse(result.body as string) } : null
        ])
    ).toMatchSnapshot();

    expect(bucket).toHaveBeenCalledTimes(1);
    expect(bucket).toHaveBeenCalledWith(process.env.WEBTOOLS_CALCULATOR_BUCKET);

    expect(file).toHaveBeenCalledTimes(1);
    expect(file).toHaveBeenCalledWith("data.json");

    expect(
      save.mock.calls.map(([body, ...rest]) => [JSON.parse(body), ...rest])
    ).toMatchSnapshot("transformed file save parameters");

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith("ok");
  });

  it("failes with the wrong secret", async () => {
    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET + "incorrect_value"}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect(fetchMock.calls().length).toEqual(0);

    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("retries when getting 429", async () => {
    const [firstResponse, ...rest] = responses;

    [[{}, { status: 429 }], firstResponse, ...rest].forEach(
      ([body, { status }]) => {
        fetchMock.postOnce(() => true, {
          body: JSON.stringify(body),
          status,
          headers: {}
        });
      }
    );

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect(
      fetchMock
        .calls()
        .slice(0, 3)
        .map(([url, result]) => [
          url,
          result ? { ...result, body: JSON.parse(result.body as string) } : null
        ])
    ).toMatchSnapshot("first and second requests match");

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith("ok");
  });

  it("errors after 6 retries when getting 429", async () => {
    mockResponses(fetchMock, {
      url: `https://graphql.contentful.com/content/v1/spaces/${process.env.WEBTOOLS_CONTENTFUL_SPACE}/environments/${process.env.WEBTOOLS_CONTENTFUL_ENVIRONMENT}`,
      method: "POST",
      body: JSON.stringify({ error: "not working" }),
      status: 429
    });

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect(fetchMock).toHaveFetchedTimes(6);
    for (let i = 1; i < 7; i++) {
      expect(fetchMock).toHaveNthFetched(
        i,
        `https://graphql.contentful.com/content/v1/spaces/${process.env.WEBTOOLS_CONTENTFUL_SPACE}/environments/${process.env.WEBTOOLS_CONTENTFUL_ENVIRONMENT}`,
        {
          method: "POST",
          body: {
            query: `
    {
      mainTileCollection(limit: 1000) {
        items {
          code
          sys {
            id
          }
        }
      }
    }
    `
          }
        }
      );
    }
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Internal Server Error");
  }, 20000);

  it("throws when getting error other than 429", async () => {
    fetchMock.postOnce(() => true, {
      body: JSON.stringify({ error: "details about the error" }),
      status: 400,
      headers: {}
    });

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Internal Server Error");

    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot(
      "thrown error"
    );
  });

  it("accepts OPTIONS request", async () => {
    const req = mockRequest("OPTIONS", {}, "/", {});
    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect((res.set as jest.Mock).mock.calls).toMatchSnapshot();
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
  });

  it("doesn't call accessSecretVersion for every request", async () => {
    responses.forEach(([body, { status }]) => {
      fetchMock.postOnce(() => true, {
        body: JSON.stringify(body),
        status,
        headers: {}
      });
    });

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    responses.forEach(([body, { status }]) => {
      fetchMock.postOnce(() => true, {
        body: JSON.stringify(body),
        status,
        headers: {}
      });
    });

    // @ts-ignore
    await handleRequest(req, res);

    expect(accessSecretVersion).toHaveBeenCalledTimes(2);

    expect((res.status as jest.Mock).mock.calls).toMatchSnapshot(
      "status calls"
    );
    expect((res.send as jest.Mock).mock.calls).toMatchSnapshot("send calls");
  });

  it("fails if accessSecretVersion doesn't return a value", async () => {
    accessSecretVersion.mockImplementation(({ name }) => {
      if (name.includes(process.env.WEBTOOLS_UPDATE_REQUEST_SECRET)) {
        return [{ payload: undefined }];
      }
      if (name.includes(process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET)) {
        return [{ payload: { data: CONTENTFUL_TOKEN } }];
      }

      throw new Error("Unkown secret");
    });

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    accessSecretVersion.mockImplementation(({ name }) => {
      if (name.includes(process.env.WEBTOOLS_UPDATE_REQUEST_SECRET)) {
        return [{ payload: { data: SECRET } }];
      }
      if (name.includes(process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET)) {
        return [{ payload: undefined }];
      }

      throw new Error("Unkown secret");
    });

    // @ts-ignore
    await handleRequest(req, res);

    expect((res.status as jest.Mock).mock.calls).toMatchSnapshot(
      "status calls"
    );
    expect((res.send as jest.Mock).mock.calls).toMatchSnapshot("send calls");

    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot(
      "error logs"
    );
  });

  it("fails if bucket isn't provided", async () => {
    process.env.WEBTOOLS_CALCULATOR_BUCKET = "";
    jest.resetModules();
    const index = require("../index");
    handleRequest = index.handleRequest;

    const res = mockResponse();

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    // Partial type match issue, ignoring for now
    // @ts-ignore
    await handleRequest(req, res);

    expect((res.status as jest.Mock).mock.calls).toMatchSnapshot(
      "status calls"
    );
    expect((res.send as jest.Mock).mock.calls).toMatchSnapshot("send calls");

    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot(
      "error logs"
    );
  });
});
