import { createContentfulDocument } from "@bmi/elasticsearch-types";
import { indexIntoES } from "../elasticsearch";

const getEsClient = jest.fn();
const getChunks = jest.fn();
const getIndexOperation = jest.fn();
const performBulkOperations = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: (...params: any) => getEsClient(...params),
  getChunks: (...params: any) => getChunks(...params),
  getIndexOperation: (...params: any) => getIndexOperation(...params),
  performBulkOperations: (...params: any) => performBulkOperations(...params)
}));

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("indexIntoES", () => {
  it("should throw error when getEsClient throws error", async () => {
    const esContentfulDocuments = [createContentfulDocument()];
    getEsClient.mockRejectedValueOnce(Error("Expected error"));

    try {
      await indexIntoES(esContentfulDocuments);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
  });

  it("should throw error when performBulkOperation throws error", async () => {
    const esClient = {};
    const esContentfulDocuments = [createContentfulDocument()];
    getEsClient.mockResolvedValueOnce(esClient);
    getChunks.mockReturnValueOnce([esContentfulDocuments]);
    const bulkOperations = [
      {
        index: {
          _index: process.env.ES_INDEX_NAME_DOCUMENTS,
          _id: esContentfulDocuments[0].id
        }
      },
      esContentfulDocuments[0]
    ];
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    performBulkOperations.mockRejectedValueOnce(Error("Expected error"));

    try {
      await indexIntoES(esContentfulDocuments);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(getChunks).toHaveBeenCalledWith(esContentfulDocuments);
    expect(getIndexOperation).toHaveBeenCalledWith(
      process.env.ES_INDEX_NAME_DOCUMENTS,
      esContentfulDocuments[0],
      esContentfulDocuments[0].id
    );
    expect(performBulkOperations).toHaveBeenCalledWith(
      esClient,
      [bulkOperations],
      process.env.ES_INDEX_NAME_DOCUMENTS
    );
  });

  it("make request to index documents into Elasticsearch", async () => {
    const esClient = {};
    const esContentfulDocuments = [createContentfulDocument()];
    getEsClient.mockResolvedValueOnce(esClient);
    getChunks.mockReturnValueOnce([esContentfulDocuments]);
    const bulkOperations = [
      {
        index: {
          _index: process.env.ES_INDEX_NAME_DOCUMENTS,
          _id: esContentfulDocuments[0].id
        }
      },
      esContentfulDocuments[0]
    ];
    getIndexOperation.mockReturnValueOnce(bulkOperations);

    await indexIntoES(esContentfulDocuments);

    expect(getEsClient).toHaveBeenCalled();
    expect(getChunks).toHaveBeenCalledWith(esContentfulDocuments);
    expect(getIndexOperation).toHaveBeenCalledWith(
      process.env.ES_INDEX_NAME_DOCUMENTS,
      esContentfulDocuments[0],
      esContentfulDocuments[0].id
    );
    expect(performBulkOperations).toHaveBeenCalledWith(
      esClient,
      [bulkOperations],
      process.env.ES_INDEX_NAME_DOCUMENTS
    );
  });
});
