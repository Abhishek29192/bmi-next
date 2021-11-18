import mockConsole from "jest-mock-console";
import {
  deleteElasticSearchIndex,
  ElasticsearchIndexes
} from "../elasticsearch";

const getEsClient = jest.fn();
const esDelete = jest.fn();
jest.mock("../es-client", () => {
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
    esDelete.mockRejectedValue(Error("Expected error"));

    try {
      await deleteElasticSearchIndex(ElasticsearchIndexes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`
    });
  });

  it("should return if deleting products index", async () => {
    await deleteElasticSearchIndex(ElasticsearchIndexes.Products);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`
    });
  });

  it("should return if deleting systems index", async () => {
    await deleteElasticSearchIndex(ElasticsearchIndexes.Systems);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDelete).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`
    });
  });
});
