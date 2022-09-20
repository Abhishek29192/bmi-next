import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "@google-cloud/functions-framework";
import { Entry } from "contentful-management";
import mockConsole from "jest-mock-console";
import { ESContentfulDocument } from "../es-model";
import SampleContentfulDeleteWebhook from "./resources/sample_contentfulWebhook_DeletedEntry.json";
import SampleContentfulEntryWebhook from "./resources/sample_contentfulWebhook_entry.json";
import SampleContentfulAsset from "./resources/sample_contentful_asset.json";
import SampleContentfulEntry from "./resources/sample_contentful_entry.json";

const REQUEST_SECRET = "some secret";

const getEsClient = jest.fn();
const ping = jest.fn();
const index = jest.fn();
const mockDelete = jest.fn();
const checkEnvVariables = jest.fn();
const checkAuthorization = jest.fn();
const checkHttpMethod = jest.fn();
const transformDocument = jest.fn();
const handleEsClientError = jest.fn();

jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});
jest.mock("../helpers", () => {
  return {
    checkEnvVariables: (response: Response) => checkEnvVariables(response),
    checkHttpMethod: (request: Request, response: Response) =>
      checkHttpMethod(request, response),
    checkAuthorization: (request: Request, response: Response) =>
      checkAuthorization(request, response),
    transformDocument: (data: Entry) => transformDocument(data),
    handleEsClientError: (params: any) => handleEsClientError(params)
  };
});

const updateESDocumentsIndex = async (
  request: Partial<Request>,
  response: Partial<Response>
): Promise<ESContentfulDocument> =>
  (await import("../index")).updateESDocumentsIndex(
    request as Request,
    response as Response
  );

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockConsole();

  getEsClient.mockImplementation(() => ({
    ping: (callback: () => any) => ping(callback),
    index: (callback: () => any) => index(callback),
    delete: (callback: () => any) => mockDelete(callback)
  }));
});

const mockESDocument = {
  __typename: "ContentfulDocument",
  id: SampleContentfulEntryWebhook.sys.id,
  title: SampleContentfulEntryWebhook.fields.title[`en-GB`],
  titleAndSize: `${SampleContentfulEntryWebhook.fields.title[`en-GB`]}_${
    SampleContentfulAsset.fields.file[`en-GB`].details?.size
  }`,
  realFileName: SampleContentfulAsset.fields.file[`en-GB`].fileName,
  asset: {
    file: {
      ...SampleContentfulAsset.fields.file[`en-GB`],
      contentType: "application/pdf"
    }
  },
  assetType: {
    name: SampleContentfulEntry.fields.name[`en-GB`],
    code: SampleContentfulEntry.fields.code[`en-GB`],
    pimCode: SampleContentfulEntry.fields.pimCode[`en-GB`]
  }
};

describe("updateESDocumentsIndex", () => {
  beforeEach(() => {
    process.env.ES_INDEX_NAME_DOCUMENTS = "es_test_index";
    transformDocument.mockResolvedValue(mockESDocument);
  });

  it("should do nothing if webhook provide wrong contentType ID", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      {
        metadata: {},
        sys: {
          contentType: {
            sys: {
              id: "contentful-builtin-asset-content-type"
            }
          }
        },
        fields: {}
      }
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);
    expect(getEsClient).not.toBeCalled();
    expect(transformDocument).not.toBeCalled();
    expect(index).not.toBeCalled();
    expect(mockDelete).not.toBeCalled();
    expect(console.log).toBeCalledWith(
      JSON.stringify({
        severity: "WARNING",
        message:
          "Function doesn't support webhooks with contentType ID other then 'document.'"
      })
    );
  });
  it("should do nothing if some of the checks failed", async () => {
    const request = mockRequest(
      "OPTIONS",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      {
        metadata: {},
        sys: {
          contentType: {
            sys: {
              id: "document"
            }
          }
        },
        fields: {}
      }
    );
    const response = mockResponse();
    checkHttpMethod.mockReturnValueOnce(true);

    await updateESDocumentsIndex(request, response);
    expect(getEsClient).not.toBeCalled();
    expect(transformDocument).not.toBeCalled();
    expect(index).not.toBeCalled();
    expect(mockDelete).not.toBeCalled();
  });

  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulEntryWebhook
    );
    const response = mockResponse();
    try {
      await updateESDocumentsIndex(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(transformDocument).toBeCalledTimes(0);
    expect(index).toBeCalledTimes(0);
    expect(mockDelete).toBeCalledTimes(0);
  });

  it("should call ES index method if webhook has 'Entry' type", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulEntryWebhook
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(index).toBeCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: SampleContentfulEntryWebhook.sys.id,
      body: mockESDocument
    });
    delete process.env.ES_INDEX_NAME_DOCUMENTS;
  });
  it("should call ES delete method if webhook has 'DeletedEntry' type", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulDeleteWebhook
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(mockDelete).toBeCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: SampleContentfulDeleteWebhook.sys.id
    });
    delete process.env.ES_INDEX_NAME_DOCUMENTS;
  });
  it("shouldn't perform index operation if document wasn't transformed", async () => {
    transformDocument.mockResolvedValueOnce(undefined);
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulEntryWebhook
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);
    expect(console.log).toBeCalledWith(
      JSON.stringify({
        severity: "ERROR",
        message: "Nothing to index"
      })
    );
    expect(index).not.toBeCalled();
  });
  it("should print error if index operation return error", async () => {
    const mockErrorMessage = "test error";
    index.mockImplementationOnce(() => {
      throw new Error(mockErrorMessage);
    });
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulEntryWebhook
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);
    expect(index).toBeCalled();
    expect(handleEsClientError).toBeCalledWith({
      error: Error(mockErrorMessage)
    });
  });
  it("should print error if delete operation return error", async () => {
    const mockErrorMessage = "test error";
    mockDelete.mockImplementationOnce(() => {
      throw new Error(mockErrorMessage);
    });
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleContentfulDeleteWebhook
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);
    expect(mockDelete).toBeCalled();
    expect(handleEsClientError).toBeCalledWith({
      error: Error(mockErrorMessage)
    });
  });
  it("should print warning message if webhook provides wrong entity type", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      {
        metadata: {},
        sys: {
          type: "wrong type",
          contentType: {
            sys: {
              id: "document"
            }
          }
        },
        fields: {}
      }
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);
    expect(console.log).toBeCalledWith(
      JSON.stringify({
        severity: "WARNING",
        message: "Webhook provides wrong type."
      })
    );
  });
});
