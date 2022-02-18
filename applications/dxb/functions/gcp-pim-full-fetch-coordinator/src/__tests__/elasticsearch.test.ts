import { ResponseError } from "@elastic/elasticsearch/lib/errors";
import mockConsole from "jest-mock-console";
import {
  deleteElasticSearchIndex,
  ElasticsearchIndexes
} from "../elasticsearch";

const getEsClient = jest.fn();
const esDelete = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  getEsClient.mockImplementation(() => ({
    indices: {
      delete: (...args: any) => esDelete(...args)
    }
  }));
});

describe("deleteElasticSearchIndex", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await deleteElasticSearchIndex(ElasticsearchIndexes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
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
      await deleteElasticSearchIndex(ElasticsearchIndexes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual(
        "index_not_found_exception: [index_not_found_exception] Reason: no such index [dxb_test_products]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`,
      ignore_unavailable: true
    });
  });

  it("should return if deleting products index", async () => {
    await deleteElasticSearchIndex(ElasticsearchIndexes.Products);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`,
      ignore_unavailable: true
    });
  });

  it("should return if deleting systems index", async () => {
    await deleteElasticSearchIndex(ElasticsearchIndexes.Systems);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`,
      ignore_unavailable: true
    });
  });
});
