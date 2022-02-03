/* eslint-disable no-console */
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { mockRequest, mockResponse, mockResponses } from "@bmi/fetch-mocks";
import { Request, Response } from "express";
import responses from "./responses.json";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const SECRET = "SOME_SECRET";
const CONTENTFUL_TOKEN = "SOME_TOKEN";

const getSecret = jest.fn();
jest.mock("@bmi/functions-secret-client", () => {
  return { getSecret };
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

const handleRequest = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).handleRequest(
    request as Request,
    response as Response
  );

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
});

afterAll(() => {
  process.env = oldEnv;
});

describe("Generating JSON file from WebTools space", () => {
  it("returns a 500 response when WEBTOOLS_CONTENTFUL_TOKEN_SECRET is not set", async () => {
    const originalWebtoolsContentfulTokenSecret =
      process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET;
    delete process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET;

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    await handleRequest(req, res);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(bucket).toHaveBeenCalledTimes(1);
    expect(bucket).toHaveBeenCalledWith(process.env.WEBTOOLS_CALCULATOR_BUCKET);
    expect(file).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.WEBTOOLS_CONTENTFUL_TOKEN_SECRET =
      originalWebtoolsContentfulTokenSecret;
  });

  it("returns a 500 response when WEBTOOLS_UPDATE_REQUEST_SECRET is not set", async () => {
    const originalWebtoolsUpdateRequestSecret =
      process.env.WEBTOOLS_UPDATE_REQUEST_SECRET;
    delete process.env.WEBTOOLS_UPDATE_REQUEST_SECRET;

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    await handleRequest(req, res);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(bucket).toHaveBeenCalledTimes(1);
    expect(bucket).toHaveBeenCalledWith(process.env.WEBTOOLS_CALCULATOR_BUCKET);
    expect(file).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.WEBTOOLS_UPDATE_REQUEST_SECRET =
      originalWebtoolsUpdateRequestSecret;
  });

  it("makes calls to Contentful and creates the transformed data file", async () => {
    getSecret.mockResolvedValueOnce(SECRET).mockResolvedValue(CONTENTFUL_TOKEN);

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

    await handleRequest(req, res);

    expect(
      fetchMock
        .calls()
        .map(([url, result]) => [
          url,
          { ...result, body: JSON.parse(result!.body as string) }
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
    getSecret.mockResolvedValueOnce(SECRET);

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET + "incorrect_value"}` },
      "/",
      {}
    );

    const res = mockResponse();

    await handleRequest(req, res);

    expect(fetchMock).not.toHaveFetched();

    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("retries when getting 429", async () => {
    getSecret.mockResolvedValueOnce(SECRET).mockResolvedValue(CONTENTFUL_TOKEN);

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

    await handleRequest(req, res);

    const requests = fetchMock
      .calls()
      .map(([url, result]) => [
        url,
        { ...result, body: JSON.parse(result!.body as string) }
      ]);

    expect(requests).toHaveLength(6);
    expect(requests[0]).toStrictEqual(requests[1]);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith("ok");
  });

  it("errors after 6 retries when getting 429", async () => {
    getSecret.mockResolvedValueOnce(SECRET).mockResolvedValue(CONTENTFUL_TOKEN);

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
    getSecret
      .mockResolvedValueOnce(SECRET)
      .mockResolvedValueOnce(CONTENTFUL_TOKEN);

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

    await handleRequest(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Internal Server Error");
  });

  it("accepts OPTIONS request", async () => {
    const req = mockRequest("OPTIONS", {}, "/", {});
    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.set).toHaveBeenCalledWith(
      "Access-Control-Allow-Methods",
      "POST, GET"
    );
    expect(res.set).toHaveBeenCalledWith("Access-Control-Allow-Headers", [
      "Content-Type",
      "Authorization"
    ]);
    expect(res.set).toHaveBeenCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
  });

  it("fails if getSecret throws an error for request secret", async () => {
    getSecret.mockRejectedValueOnce(new Error("Expected error"));

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error");
  });

  it("fails if getSecret throws an error for Contentful token", async () => {
    getSecret
      .mockResolvedValueOnce(SECRET)
      .mockRejectedValueOnce(new Error("Expected error"));

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    const res = mockResponse();

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error");
  });

  it("fails if bucket isn't provided", async () => {
    delete process.env.WEBTOOLS_CALCULATOR_BUCKET;

    getSecret.mockResolvedValueOnce(SECRET);

    const res = mockResponse();

    const req = mockRequest(
      "GET",
      { authorization: `Bearer ${SECRET}` },
      "/",
      {}
    );

    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error");
  });
});
