import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "@google-cloud/functions-framework";
import mockConsole from "jest-mock-console";

const checkEnvVariablesMissing = async (response: Partial<Response>) =>
  (await import("../helpers")).checkEnvVariablesMissing(response as Response);

const checkAuthorization = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../helpers")).checkAuthorization(
    request as Request,
    response as Response
  );

const checkHttpMethod = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../helpers")).checkHttpMethod(
    request as Request,
    response as Response
  );

beforeEach(() => {
  mockConsole();
  process.env.MARKET_LOCALE = "en-US";
});

describe("checkEnvVariablesMissing", () => {
  it.each([
    "ES_DOCUMENTS_INGEST_SECRET",
    "ES_INDEX_NAME_DOCUMENTS",
    "MANAGEMENT_ACCESS_TOKEN",
    "SPACE_ID",
    "CONTENTFUL_ENVIRONMENT",
    "MARKET_LOCALE"
  ])(
    "Returns true with a 500 response sent when %s is not set",
    async (name) => {
      // eslint-disable-next-line security/detect-object-injection
      const original = process.env[name];
      // eslint-disable-next-line security/detect-object-injection
      delete process.env[name];

      const response = mockResponse();

      const envVariablesMissing = await checkEnvVariablesMissing(response);

      expect(envVariablesMissing).toEqual(true);
      expect(response.sendStatus).toHaveBeenCalledWith(500);

      // eslint-disable-next-line security/detect-object-injection
      process.env[name] = original;
    }
  );

  it("Returns false when all required environment variables are set", async () => {
    const response = mockResponse();

    const envVariablesMissing = await checkEnvVariablesMissing(response);

    expect(envVariablesMissing).toEqual(false);
    expect(response.sendStatus).not.toHaveBeenCalled();
  });
});

describe("checkAuthorization", () => {
  it("Returns true with a 401 response when authorisation header is empty", async () => {
    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    const authorised = await checkAuthorization(mockReq, mockRes);

    expect(authorised).toEqual(true);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  it("Returns true with a 401 response when 'Bearer ' string is missing", async () => {
    const mockReq = mockRequest("POST", { authorization: "some value" });
    const mockRes = mockResponse();

    const authorised = await checkAuthorization(mockReq, mockRes);

    expect(authorised).toEqual(true);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  it("Returns true with a 401 response when Bearer token is missing", async () => {
    const mockReq = mockRequest("POST", { authorization: "Bearer " });
    const mockRes = mockResponse();

    const authorised = await checkAuthorization(mockReq, mockRes);

    expect(authorised).toEqual(true);
    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns true with a 401 response when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${shortSecret}`
    });
    const mockRes = mockResponse();

    const authorised = await checkAuthorization(mockReq, mockRes);

    expect(authorised).toEqual(true);
    await checkAuthorization(mockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  it("Returns false when Bearer token matches ES_DOCUMENTS_INGEST_SECRET", async () => {
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${process.env.ES_DOCUMENTS_INGEST_SECRET}`
    });
    const mockRes = mockResponse();

    const authorised = await checkAuthorization(mockReq, mockRes);

    expect(authorised).toEqual(false);
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
  });
});

describe("checkHttpMethod", () => {
  it.each([
    "GET",
    "HEAD",
    "PUT",
    "DELETE",
    "CONNECT",
    "TRACE",
    "PATCH",
    "OPTIONS"
  ])(
    "Returns true with 405 response when %s method is used",
    async (method) => {
      const request = mockRequest(method);
      const response = mockResponse();

      const isInvalidHttpMethod = await checkHttpMethod(request, response);

      expect(isInvalidHttpMethod).toEqual(true);
      expect(response.sendStatus).toHaveBeenCalledWith(405);
    }
  );

  it("Returns false when POST method is used", async () => {
    const request = mockRequest("POST");
    const response = mockResponse();

    const isInvalidHttpMethod = await checkHttpMethod(request, response);

    expect(isInvalidHttpMethod).toEqual(false);
    expect(response.sendStatus).not.toHaveBeenCalled();
  });
});
