// import { render, screen } from "@testing-library/react";
import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { ApiError, ApiResponse } from "@elastic/elasticsearch";
import { Request, Response } from "@google-cloud/functions-framework";
import { Entry } from "contentful-management";
import mockConsole from "jest-mock-console";
import { ESContentfulDocument } from "../es-model";
import SampleContentfulWebhook from "./resources/sample_contentfulWebhook_entry.json";
import SampleContentfulAsset from "./resources/sample_contentful_asset.json";
import SampleContentfulEntry from "./resources/sample_contentful_entry.json";

const REQUEST_SECRET = "some secret";
const getSecret = jest.fn();
const getSpace = jest.fn();
const getEsClient = jest.fn();
const getEnvironment = jest.fn();
const getAsset = jest.fn().mockReturnValue({
  sys: SampleContentfulAsset.sys,
  fields: SampleContentfulAsset.fields
});
const getEntry = jest.fn().mockReturnValue({
  sys: SampleContentfulEntry.sys,
  fields: SampleContentfulEntry.fields
});
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});
getSecret.mockReturnValue(REQUEST_SECRET);

getEnvironment.mockResolvedValue({ getAsset: getAsset, getEntry: getEntry });
getSpace.mockResolvedValue({ getEnvironment: getEnvironment });
jest.mock("contentful-management", () => ({
  createClient: () => ({
    getSpace: getSpace
  })
}));
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});

const transformDocument = async (
  document: Entry
): Promise<ESContentfulDocument> =>
  (await import("../helpers")).transformDocument(document);

const checkEnvVariables = async (response: Partial<Response>) =>
  (await import("../helpers")).checkEnvVariables(response as Response);

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

const handleEsClientError = async (
  error: Partial<ApiError>,
  response: Partial<ApiResponse>
) =>
  (await import("../helpers")).handleEsClientError(
    error as ApiError,
    response as ApiResponse
  );

describe("helpers", () => {
  beforeEach(() => {
    mockConsole();
    process.env.LOCALE = "en-GB";
  });
  describe("transformDocument", () => {
    it("should transform Contentful document to ES document", async () => {
      const esDocument = await transformDocument(
        SampleContentfulWebhook as unknown as Entry
      );
      expect(esDocument).toStrictEqual({
        __typename: "ContentfulDocument",
        id: SampleContentfulWebhook.sys.id,
        title: SampleContentfulWebhook.fields.title[`en-GB`],
        titleAndSize: `${SampleContentfulWebhook.fields.title[`en-GB`]}_${
          SampleContentfulAsset.fields.file[`en-GB`].details?.size
        }`,
        realFileName: SampleContentfulAsset.fields.file[`en-GB`].fileName,
        asset: {
          file: {
            ...SampleContentfulAsset.fields.file[`en-GB`],
            contentType: "application/pdf"
          }
        },
        noIndex: false,
        BRAND: {
          code: SampleContentfulWebhook.fields.brand[`en-GB`],
          name: SampleContentfulWebhook.fields.brand[`en-GB`]
        },
        assetType: {
          name: SampleContentfulEntry.fields.name[`en-GB`],
          code: SampleContentfulEntry.fields.code[`en-GB`],
          pimCode: SampleContentfulEntry.fields.pimCode[`en-GB`]
        }
      });
    });
  });

  describe("checkEnvVariables", () => {
    it.each([
      "ES_DOCUMENTS_INGEST_SECRET",
      "ES_DOCUMENTS_INDEX_NAME",
      "MANAGEMENT_ACCESS_TOKEN_SECRET",
      "SPACE_ID",
      "CONTENTFUL_ENVIRONMENT"
    ])("Returns 500, when %s is not set", async (name) => {
      // eslint-disable-next-line security/detect-object-injection
      const original = process.env[name];
      // eslint-disable-next-line security/detect-object-injection
      delete process.env[name];

      const response = mockResponse();

      await checkEnvVariables(response);

      expect(response.sendStatus).toBeCalledWith(500);

      // eslint-disable-next-line security/detect-object-injection
      process.env[name] = original;
    });
  });

  describe("checkAuthorization", () => {
    it("Returns 401 when authorisation header is empty", async () => {
      const mockReq = mockRequest("POST");
      const mockRes = mockResponse();

      await checkAuthorization(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(401);
    });

    it("Returns 401 when 'Bearer ' string is missing", async () => {
      const mockReq = mockRequest("POST", { authorization: "some value" });
      const mockRes = mockResponse();

      await checkAuthorization(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(401);
    });

    it("Returns 401 when Bearer token is missing", async () => {
      getSecret.mockReturnValueOnce("");
      const mockReq = mockRequest("POST", { authorization: "Bearer " });
      const mockRes = mockResponse();

      await checkAuthorization(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(401);
    });

    it("Returns 401 when Bearer token is less than 10 characters long", async () => {
      const shortSecret = "123";
      getSecret.mockReturnValueOnce(shortSecret);
      const mockReq = mockRequest("POST", {
        authorization: `Bearer ${shortSecret}`
      });
      const mockRes = mockResponse();

      await checkAuthorization(mockReq, mockRes);

      expect(mockRes.sendStatus).toBeCalledWith(401);
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
    ])("Returns 405, when %s method is used", async (method) => {
      const request = mockRequest(method);
      const response = mockResponse();

      await checkHttpMethod(request, response);

      expect(response.sendStatus).toBeCalledWith(405);
    });
  });

  describe("handleEsClientError", () => {
    it("should log messages twice if error occure", async () => {
      await handleEsClientError(
        { name: "test error", message: "test error message" },
        { statusCode: 400 }
      );

      expect(console.log).toBeCalledTimes(1);
    });
    it("should print message with successfully indexed document", async () => {
      await handleEsClientError(
        {},
        {
          statusCode: 200,
          body: { _id: "test id", result: "created" }
        }
      );

      expect(console.log).toBeCalledWith(
        JSON.stringify({
          severity: "INFO",
          message: 'Document with ID = "test id" was created.'
        })
      );
    });
  });
});
