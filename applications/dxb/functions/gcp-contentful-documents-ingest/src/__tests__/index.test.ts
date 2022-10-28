import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import {
  createSys,
  Document as ContentfulDocument
} from "@bmi/contentful-types";
import {
  ContentfulDocument as EsContentfulDocument,
  createContentfulDocument as createEsContentfulDocument
} from "@bmi/elasticsearch-types";
import { Request, Response } from "@google-cloud/functions-framework";
import { Entry } from "contentful";
import createContentfulDeletedRequestBody from "./helpers/contentfulDeletedRequestBodyHelper";
import createContentfulPublishedRequestBody from "./helpers/contentfulPublishedRequestBodyHelper";

const getEsClient = jest.fn();
const index = jest.fn();
const mockDelete = jest.fn();
const mockClient = {
  index: (...params: any[]) => index(...params),
  delete: (...params: any[]) => mockDelete(...params)
};
getEsClient.mockResolvedValue(mockClient);
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...params: any[]) => getEsClient(...params) };
});

const checkEnvVariablesMissing: jest.Mock<boolean, [Response]> = jest.fn();
const checkAuthorization: jest.Mock<boolean, [Request, Response]> = jest.fn();
const checkHttpMethod: jest.Mock<boolean, [Request, Response]> = jest.fn();
jest.mock("../helpers", () => ({
  checkEnvVariablesMissing: (response: Response) =>
    checkEnvVariablesMissing(response),
  checkAuthorization: (request: Request, response: Response) =>
    checkAuthorization(request, response),
  checkHttpMethod: (request: Request, response: Response) =>
    checkHttpMethod(request, response)
}));

const transformDocument: jest.Mock<
  Promise<EsContentfulDocument>,
  [Entry<ContentfulDocument>]
> = jest.fn();
jest.mock("../documentTransformer", () => ({
  transformDocument: (document: Entry<ContentfulDocument>) =>
    transformDocument(document)
}));

const updateESDocumentsIndex = async (
  request: Partial<Request>,
  response: Partial<Response>
): Promise<ContentfulDocument> =>
  (await import("../index")).updateESDocumentsIndex(
    request as Request,
    response as Response
  );

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

beforeEach(() => {
  process.env.ES_INDEX_NAME_DOCUMENTS = "es_test_index";
});

describe("updateESDocumentsIndex", () => {
  it("should do nothing if env variables are missing", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(true);
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulPublishedRequestBody()
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).not.toHaveBeenCalled();
    expect(checkHttpMethod).not.toHaveBeenCalled();
    expect(getEsClient).not.toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should do nothing if check authorisation fails", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(true);
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer invalid-token"
      },
      "http://localhost:9000",
      createContentfulPublishedRequestBody()
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).not.toHaveBeenCalled();
    expect(getEsClient).not.toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should do nothing if check HTTP method is not POST", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(true);
    const request = mockRequest(
      "GET",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulPublishedRequestBody()
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).not.toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should return status 400 if body doesn't have a body", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    const request = mockRequest("POST", {
      authorization: "Bearer some-super-secret-token"
    });
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(400);
    expect(getEsClient).not.toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("should return status 400 if content type ID is not 'document'", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulPublishedRequestBody({
        sys: createSys({
          contentType: {
            sys: { type: "Link", linkType: "ContentType", id: "page" }
          }
        })
      })
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(400);
    expect(getEsClient).not.toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("should throw error if getEsClient throws an error", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    getEsClient.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulPublishedRequestBody()
    );
    const response = mockResponse();

    try {
      await updateESDocumentsIndex(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should return status 400 when transformDocument throws error", async () => {
    const contentfulPublishedRequestBody =
      createContentfulPublishedRequestBody();
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    transformDocument.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      contentfulPublishedRequestBody
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(transformDocument).toHaveBeenCalledWith(
      contentfulPublishedRequestBody
    );
    expect(response.sendStatus).toHaveBeenCalledWith(400);
    expect(index).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("should throw error when index into ES throws error", async () => {
    const contentfulPublishedRequestBody =
      createContentfulPublishedRequestBody();
    const transformedDocument = createEsContentfulDocument();
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    transformDocument.mockResolvedValueOnce(transformedDocument);
    index.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      contentfulPublishedRequestBody
    );
    const response = mockResponse();

    try {
      await updateESDocumentsIndex(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(transformDocument).toHaveBeenCalledWith(
      contentfulPublishedRequestBody
    );
    expect(index).toHaveBeenCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: transformedDocument.id,
      body: transformedDocument
    });
    expect(mockDelete).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should return status 200 when index into ES is successful", async () => {
    const contentfulPublishedRequestBody =
      createContentfulPublishedRequestBody();
    const transformedDocument = createEsContentfulDocument();
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    transformDocument.mockResolvedValueOnce(transformedDocument);
    index.mockResolvedValueOnce({
      body: {
        _shards: {
          total: 2,
          failed: 0,
          successful: 2
        },
        _index: process.env.ES_INDEX_NAME_DOCUMENTS,
        _id: transformedDocument.id,
        _version: 1,
        _seq_no: 0,
        _primary_term: 1,
        result: "created"
      }
    });
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      contentfulPublishedRequestBody
    );
    const response = mockResponse();

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(transformDocument).toHaveBeenCalledWith(
      contentfulPublishedRequestBody
    );
    expect(index).toHaveBeenCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: transformedDocument.id,
      body: transformedDocument
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("should throw error when delete from ES throws error", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    mockDelete.mockRejectedValueOnce(Error("Expected error"));
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulDeletedRequestBody()
    );
    const response = mockResponse();

    try {
      await updateESDocumentsIndex(request, response);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: request.body.sys.id
    });
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it("should return status 200 when delete from ES is successful", async () => {
    checkEnvVariablesMissing.mockReturnValueOnce(false);
    checkAuthorization.mockReturnValueOnce(false);
    checkHttpMethod.mockReturnValueOnce(false);
    const request = mockRequest(
      "POST",
      {
        authorization: "Bearer some-super-secret-token"
      },
      "http://localhost:9000",
      createContentfulDeletedRequestBody()
    );
    const response = mockResponse();
    mockDelete.mockResolvedValueOnce({
      body: {
        _shards: {
          total: 2,
          failed: 0,
          successful: 2
        },
        _index: process.env.ES_INDEX_NAME_DOCUMENTS,
        _id: request.body.sys.id,
        _version: 2,
        _primary_term: 1,
        _seq_no: 5,
        result: "deleted"
      }
    });

    await updateESDocumentsIndex(request, response);

    expect(checkEnvVariablesMissing).toHaveBeenCalledWith(response);
    expect(checkAuthorization).toHaveBeenCalledWith(request, response);
    expect(checkHttpMethod).toHaveBeenCalledWith(request, response);
    expect(getEsClient).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith({
      index: process.env.ES_INDEX_NAME_DOCUMENTS,
      id: request.body.sys.id
    });
    expect(response.sendStatus).toHaveBeenCalledWith(200);
    expect(transformDocument).not.toHaveBeenCalled();
    expect(index).not.toHaveBeenCalled();
  });
});
