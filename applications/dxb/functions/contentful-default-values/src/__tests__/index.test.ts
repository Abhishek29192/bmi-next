import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import mockConsole from "jest-mock-console";
import { Space, ClientAPI, Environment } from "contentful-management";
import SampleEntryWebhook from "./resources/contentfulWebhook_entry.json";
import SampleAssetWebhook from "./resources/contentfulWebhook_asset.json";
import SampleContentfulEntry from "./resources/sample_entry.json";
import SampleContentfulAsset from "./resources/sample_asset.json";

const fill = async (request: Partial<Request>, response: Partial<Response>) =>
  await await (
    await import("../index")
  ).fill(request as Request, response as Response);

const REQUEST_SECRET = "some secret";
const getSecret = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});
getSecret.mockReturnValue(REQUEST_SECRET);

const update = jest.fn();
const getAsset = jest
  .fn()
  .mockReturnValue({ sys: SampleContentfulAsset.sys, update });
const getEntry = jest
  .fn()
  .mockReturnValue({ sys: SampleContentfulEntry.sys, update });
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

const findLocalesFromTag = jest.fn().mockReturnValue(["en-GB"]);
const findIrrelevantLocales = jest.fn().mockReturnValue({});
const copyDefaultValues = jest.fn();
jest.mock("../locale.ts", () => {
  return { findLocalesFromTag, findIrrelevantLocales, copyDefaultValues };
});

beforeEach(() => {
  mockConsole();
});

describe("fill", () => {
  it.each([
    "DEFAULT_VALUES_REQUEST_SECRET",
    "MANAGEMENT_ACCESS_TOKEN_SECRET",
    "SPACE_ID",
    "CONTENTFUL_ENVIRONMENT",
    "MARKET_LOCALES"
  ])("Returns 500, when %s is not set", async (name) => {
    // eslint-disable-next-line security/detect-object-injection
    const original = process.env[name];
    // eslint-disable-next-line security/detect-object-injection
    delete process.env[name];

    const request = mockRequest("POST");
    const response = mockResponse();

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(500);

    // eslint-disable-next-line security/detect-object-injection
    process.env[name] = original;
  });

  it.each([
    "GET",
    "HEAD",
    "PUT",
    "DELETE",
    "CONNECT",
    "TRACE",
    "PATCH",
    "OPTIONS"
  ])("Returns 405, when %s method is used", async (method) => {
    const request = mockRequest(method);
    const response = mockResponse();

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(405);
  });

  it("Returns 401 when authorisation header is empty", async () => {
    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await fill(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when 'Bearer ' string is missing", async () => {
    const mockReq = mockRequest("POST", { authorization: "some value" });
    const mockRes = mockResponse();

    await fill(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is missing", async () => {
    getSecret.mockReturnValueOnce("");
    const mockReq = mockRequest("POST", { authorization: "Bearer " });
    const mockRes = mockResponse();

    await fill(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    getSecret.mockReturnValueOnce(shortSecret);
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${shortSecret}`
    });
    const mockRes = mockResponse();

    await fill(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 500 if entry is not found", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    getEntry.mockReturnValueOnce(undefined);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if asset is not found", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleAssetWebhook
    );
    const response = mockResponse();
    getAsset.mockReturnValueOnce(undefined);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if request body is not correclty formatted", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      undefined
    );
    const response = mockResponse();

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 400 if locale could not be found from the market tags", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    findLocalesFromTag.mockReturnValueOnce(undefined);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 400 if all the locales in the environment belong to this market", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    findIrrelevantLocales.mockReturnValueOnce(undefined);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Sends 200 if default values are already up to date", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    copyDefaultValues.mockResolvedValueOnce(false);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  it("Sends 201 if the default values have been set up successfully", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    copyDefaultValues.mockResolvedValueOnce(true);

    await fill(request, response);

    expect(response.sendStatus).toBeCalledWith(201);
  });
});
