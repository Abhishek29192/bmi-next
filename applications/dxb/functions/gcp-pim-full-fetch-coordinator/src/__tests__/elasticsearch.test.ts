import { ResponseError } from "@elastic/elasticsearch/lib/errors";
import mockConsole from "jest-mock-console";
import { ESContentfulDocument } from "../contentful";
import {
  createElasticSearchIndex,
  deleteElasticSearchIndex,
  ElasticsearchIndexes,
  performBulkIndexing
} from "../elasticsearch";
import { getEsDocumentMock } from "../__mocks__/contentful.mock";

const getEsClient = jest.fn();
const esCreate = jest.fn();
const esDelete = jest.fn();
const esBulkMethodMock = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});
const loggerError = jest.fn();
const loggerInfo = jest.fn();
const loggerDebug = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message),
  debug: (message: any) => loggerDebug(message)
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  getEsClient.mockImplementation(() => ({
    indices: {
      create: (...args: any) => esCreate(...args),
      delete: (...args: any) => esDelete(...args)
    },
    bulk: (...args: any) => esBulkMethodMock(...args)
  }));
});

const productsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
const systemsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
const documentIndex = process.env.ES_INDEX_NAME_DOCUMENTS;

describe("createElasticSearchIndex", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await createElasticSearchIndex(ElasticsearchIndexes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).not.toHaveBeenCalled();
  });

  it("should error if creating index throws error", async () => {
    esCreate.mockRejectedValue(
      new ResponseError({
        body: {
          error: {
            root_cause: [
              {
                type: "security_exception",
                reason:
                  "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
              }
            ],
            type: "security_exception",
            reason:
              "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
          },
          status: 403
        },
        statusCode: 403,
        headers: {},
        meta: {} as any,
        warnings: null
      })
    );

    try {
      await createElasticSearchIndex(productsIndex);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "security_exception: [security_exception] Reason: action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: productsIndex });
  });

  it("should return if creating products index", async () => {
    await createElasticSearchIndex(productsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: productsIndex });
  });

  it("should return if creating systems index", async () => {
    await createElasticSearchIndex(systemsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: systemsIndex });
  });
});

describe("deleteElasticSearchIndex", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await deleteElasticSearchIndex(productsIndex);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).not.toHaveBeenCalled();
  });

  it("should error if deleting index throws error", async () => {
    esDelete.mockRejectedValue(
      new ResponseError({
        body: {
          error: {
            root_cause: [
              {
                type: "index_not_found_exception",
                reason: "no such index [dxb_test_products]",
                "resource.type": "index_or_alias",
                "resource.id": "dxb_test_products",
                index_uuid: "_na_",
                index: "dxb_test_products"
              }
            ],
            type: "index_not_found_exception",
            reason: "no such index [dxb_test_products]",
            "resource.type": "index_or_alias",
            "resource.id": "dxb_test_products",
            index_uuid: "_na_",
            index: "dxb_test_products"
          },
          status: 404
        },
        statusCode: 404,
        headers: {},
        meta: {} as any,
        warnings: null
      })
    );

    try {
      await deleteElasticSearchIndex(productsIndex);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "index_not_found_exception: [index_not_found_exception] Reason: no such index [dxb_test_products]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: productsIndex,
      ignore_unavailable: true
    });
  });

  it("should return if deleting products index", async () => {
    await deleteElasticSearchIndex(productsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: productsIndex,
      ignore_unavailable: true
    });
  });

  it("should return if deleting systems index", async () => {
    await deleteElasticSearchIndex(systemsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: systemsIndex,
      ignore_unavailable: true
    });
  });
});

describe("performBulkIndexing", () => {
  it("should perform bulk operation and log a count of items", async () => {
    esBulkMethodMock.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    const items = Array.from(Array(2)).map((_, index) =>
      getEsDocumentMock(String(index))
    );
    await performBulkIndexing(items as unknown as ESContentfulDocument[]);
    expect(esBulkMethodMock).toBeCalledWith({
      index: documentIndex,
      refresh: true,
      body: [
        {
          index: {
            _index: documentIndex,
            _id: items[0].id
          }
        },
        items[0],
        {
          index: {
            _index: documentIndex,
            _id: items[1].id
          }
        },
        items[1]
      ]
    });
  });
  it("should log error if bulk response with error", async () => {
    const responseMock = {
      _id: "test id",
      status: 400,
      error: {
        type: "document_missing_exception",
        reason: "[_doc][6]: document missing",
        index_uuid: "aAsFqTI0Tc2W0LCWgPNrOA",
        shard: "0",
        index: "index1"
      }
    };
    esBulkMethodMock.mockResolvedValue({
      body: {
        errors: true,
        items: [
          {
            index: { ...responseMock }
          }
        ]
      }
    });
    const items = [getEsDocumentMock("1")];
    await performBulkIndexing(items as unknown as ESContentfulDocument[]);
    expect(loggerError).toBeCalledWith({
      message: `Failed to index ${responseMock._id} with error ${JSON.stringify(
        responseMock.error,
        null,
        2
      )}`
    });
  });
});
