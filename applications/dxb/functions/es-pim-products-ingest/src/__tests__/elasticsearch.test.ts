import {
  createPimProductDocument,
  createProduct as createEsProduct,
  createSystem as createEsSystem
} from "@bmi/elasticsearch-types";
import { RequestParams } from "@elastic/elasticsearch";
import { updateDocuments, updateItems } from "../elasticsearch";

const getEsClient = jest.fn();
const count = jest.fn();
const deleteByQuery = jest.fn();
const getChunks = jest.fn();
const getIndexOperation = jest.fn();
const getDeleteOperation = jest.fn();
const performBulkOperations = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: (...params: any) => getEsClient(...params),
  getChunks: (...params: any) => getChunks(...params),
  getIndexOperation: (...params: any) => getIndexOperation(...params),
  getDeleteOperation: (...params: any) => getDeleteOperation(...params),
  performBulkOperations: (...params: any) => performBulkOperations(...params)
}));

const mockClient = {
  count: (params: RequestParams.Count) => count(params),
  deleteByQuery: (params: RequestParams.DeleteByQuery) => deleteByQuery(params)
};
getEsClient.mockResolvedValue(mockClient);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("updateItems", () => {
  it("should do nothing if ES_INDEX_PREFIX has not been set", async () => {
    const originalEsIndexPrefix = process.env.ES_INDEX_PREFIX;
    delete process.env.ES_INDEX_PREFIX;

    await updateItems("PRODUCTS", [createEsProduct()]);

    expect(getEsClient).not.toBeCalled();
    expect(getChunks).not.toBeCalled();
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).not.toBeCalled();
    expect(count).not.toBeCalled();
    expect(deleteByQuery).not.toBeCalled();

    process.env.ES_INDEX_PREFIX = originalEsIndexPrefix;
  });

  it("should throw error when getEsClient throws error", async () => {
    getEsClient.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateItems("PRODUCTS", [createEsProduct()]);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(getChunks).not.toBeCalled();
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).not.toBeCalled();
    expect(count).not.toBeCalled();
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should throw error when performBulkOperations throws error", async () => {
    const esProducts = [createEsProduct()];
    const index = `${process.env.ES_INDEX_PREFIX}_products`;
    const bulkOperations = [
      {
        index: {
          _index: index,
          _id: esProducts[0].code
        }
      },
      esProducts[0]
    ];
    getChunks.mockReturnValueOnce([esProducts]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    performBulkOperations.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateItems("PRODUCTS", esProducts);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esProducts);
    expect(getIndexOperation).toBeCalledWith(
      index,
      esProducts[0],
      esProducts[0].code
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).not.toBeCalled();
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should throw error when count throws error", async () => {
    const esProducts = [createEsProduct()];
    const index = `${process.env.ES_INDEX_PREFIX}_products`;
    const bulkOperations = [
      {
        index: {
          _index: index,
          _id: esProducts[0].code
        }
      },
      esProducts[0]
    ];
    getChunks.mockReturnValueOnce([esProducts]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    performBulkOperations.mockResolvedValueOnce({});
    count.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateItems("PRODUCTS", esProducts);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esProducts);
    expect(getIndexOperation).toBeCalledWith(
      index,
      esProducts[0],
      esProducts[0].code
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should index product if approval status is approved", async () => {
    const esProducts = [createEsProduct({ approvalStatus: "approved" })];
    const index = `${process.env.ES_INDEX_PREFIX}_products`;
    const bulkOperations = [
      {
        index: {
          _index: index,
          _id: esProducts[0].code
        }
      },
      esProducts[0]
    ];
    getChunks.mockReturnValueOnce([esProducts]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("PRODUCTS", esProducts);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esProducts);
    expect(getIndexOperation).toBeCalledWith(
      index,
      esProducts[0],
      esProducts[0].code
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should delete product if approval status is check", async () => {
    const esProducts = [createEsProduct({ approvalStatus: "check" })];
    const index = `${process.env.ES_INDEX_PREFIX}_products`;
    const bulkOperations = [
      {
        delete: {
          _index: index,
          _id: esProducts[0].code
        }
      }
    ];
    getChunks.mockReturnValueOnce([esProducts]);
    getDeleteOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("PRODUCTS", esProducts);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esProducts);
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).toBeCalledWith(index, esProducts[0].code);
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should delete product if approval status is unapproved", async () => {
    const esProducts = [createEsProduct({ approvalStatus: "unapproved" })];
    const index = `${process.env.ES_INDEX_PREFIX}_products`;
    const bulkOperations = [
      {
        delete: {
          _index: index,
          _id: esProducts[0].code
        }
      }
    ];
    getChunks.mockReturnValueOnce([esProducts]);
    getDeleteOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("PRODUCTS", esProducts);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esProducts);
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).toBeCalledWith(index, esProducts[0].code);
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should index system if approval status is approved", async () => {
    const esSystems = [createEsSystem({ approvalStatus: "approved" })];
    const index = `${process.env.ES_INDEX_PREFIX}_systems`;
    const bulkOperations = [
      {
        index: {
          _index: index,
          _id: esSystems[0].code
        }
      },
      esSystems[0]
    ];
    getChunks.mockReturnValueOnce([esSystems]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("SYSTEMS", esSystems);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esSystems);
    expect(getIndexOperation).toBeCalledWith(
      index,
      esSystems[0],
      esSystems[0].code
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should delete system if approval status is check", async () => {
    const esSystems = [createEsSystem({ approvalStatus: "check" })];
    const index = `${process.env.ES_INDEX_PREFIX}_systems`;
    const bulkOperations = [
      {
        delete: {
          _index: index,
          _id: esSystems[0].code
        }
      }
    ];
    getChunks.mockReturnValueOnce([esSystems]);
    getDeleteOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("SYSTEMS", esSystems);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esSystems);
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).toBeCalledWith(index, esSystems[0].code);
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });

  it("should delete system if approval status is unapproved", async () => {
    const esSystems = [createEsSystem({ approvalStatus: "unapproved" })];
    const index = `${process.env.ES_INDEX_PREFIX}_systems`;
    const bulkOperations = [
      {
        delete: {
          _index: index,
          _id: esSystems[0].code
        }
      }
    ];
    getChunks.mockReturnValueOnce([esSystems]);
    getDeleteOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateItems("SYSTEMS", esSystems);

    expect(getEsClient).toBeCalled();
    expect(getChunks).toBeCalledWith(esSystems);
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).toBeCalledWith(index, esSystems[0].code);
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
    expect(deleteByQuery).not.toBeCalled();
  });
});

describe("updateDocuments", () => {
  it("should do nothing if ES_INDEX_NAME_DOCUMENTS has not been set", async () => {
    const originalEsIndexNameDocuments = process.env.ES_INDEX_NAME_DOCUMENTS;
    delete process.env.ES_INDEX_NAME_DOCUMENTS;

    await updateDocuments([createPimProductDocument()], "itemCode");

    expect(getEsClient).not.toBeCalled();
    expect(deleteByQuery).not.toBeCalled();
    expect(getChunks).not.toBeCalled();
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).not.toBeCalled();
    expect(count).not.toBeCalled();

    process.env.ES_INDEX_NAME_DOCUMENTS = originalEsIndexNameDocuments;
  });

  it("should throw error when getEsClient throws error", async () => {
    getEsClient.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateDocuments([createPimProductDocument()], "itemCode");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).not.toBeCalled();
    expect(getChunks).not.toBeCalled();
    expect(getIndexOperation).not.toBeCalled();
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).not.toBeCalled();
    expect(count).not.toBeCalled();
  });

  it("should continue indexing document when deleteByQuery throws error", async () => {
    const index = process.env.ES_INDEX_NAME_DOCUMENTS;
    const itemCode = "itemCode";
    const pimDocuments = [createPimProductDocument()];
    const bulkOperations = [
      { index: { _index: index, _id: pimDocuments[0].id } },
      pimDocuments[0]
    ];
    deleteByQuery.mockRejectedValueOnce(Error("Throw unexpected error"));

    getChunks.mockReturnValueOnce([pimDocuments]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateDocuments([createPimProductDocument()], itemCode);

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index,
      body: {
        query: {
          bool: {
            must: {
              term: { "productBaseCode.keyword": itemCode }
            }
          }
        }
      }
    });
    expect(getChunks).toBeCalledWith(pimDocuments);
    expect(getIndexOperation).toBeCalledWith(
      index,
      pimDocuments[0],
      pimDocuments[0].id
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
  });

  it("should throw error when performBulkOperations throws error", async () => {
    const index = process.env.ES_INDEX_NAME_DOCUMENTS;
    const itemCode = "itemCode";
    const pimDocuments = [createPimProductDocument()];
    const bulkOperations = [
      { index: { _index: index, _id: pimDocuments[0].id } },
      pimDocuments[0]
    ];
    getChunks.mockReturnValueOnce([pimDocuments]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    performBulkOperations.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateDocuments(pimDocuments, itemCode);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index,
      body: {
        query: {
          bool: {
            must: {
              term: { "productBaseCode.keyword": itemCode }
            }
          }
        }
      }
    });
    expect(getChunks).toBeCalledWith(pimDocuments);
    expect(getIndexOperation).toBeCalledWith(
      index,
      pimDocuments[0],
      pimDocuments[0].id
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).not.toBeCalled();
  });

  it("should throw error when count throws error", async () => {
    const index = process.env.ES_INDEX_NAME_DOCUMENTS;
    const itemCode = "itemCode";
    const pimDocuments = [createPimProductDocument()];
    const bulkOperations = [
      { index: { _index: index, _id: pimDocuments[0].id } },
      pimDocuments[0]
    ];
    getChunks.mockReturnValueOnce([pimDocuments]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    count.mockRejectedValueOnce(Error("Expected error"));

    try {
      await updateDocuments(pimDocuments, itemCode);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index,
      body: {
        query: {
          bool: {
            must: {
              term: { "productBaseCode.keyword": itemCode }
            }
          }
        }
      }
    });
    expect(getChunks).toBeCalledWith(pimDocuments);
    expect(getIndexOperation).toBeCalledWith(
      index,
      pimDocuments[0],
      pimDocuments[0].id
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
  });

  it("should index documents into Elasticsearch", async () => {
    const index = process.env.ES_INDEX_NAME_DOCUMENTS;
    const itemCode = "itemCode";
    const pimDocuments = [createPimProductDocument()];
    const bulkOperations = [
      { index: { _index: index, _id: pimDocuments[0].id } },
      pimDocuments[0]
    ];
    getChunks.mockReturnValueOnce([pimDocuments]);
    getIndexOperation.mockReturnValueOnce(bulkOperations);
    count.mockResolvedValueOnce({ body: { count: 1 } });

    await updateDocuments(pimDocuments, itemCode);

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index,
      body: {
        query: {
          bool: {
            must: {
              term: { "productBaseCode.keyword": itemCode }
            }
          }
        }
      }
    });
    expect(getChunks).toBeCalledWith(pimDocuments);
    expect(getIndexOperation).toBeCalledWith(
      index,
      pimDocuments[0],
      pimDocuments[0].id
    );
    expect(getDeleteOperation).not.toBeCalled();
    expect(performBulkOperations).toBeCalledWith(
      mockClient,
      [bulkOperations],
      index
    );
    expect(count).toBeCalledWith({ index });
  });
});
