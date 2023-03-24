import { ApiResponse, Client } from "@elastic/elasticsearch";
import { BulkApiResponse } from "../types";
import {
  getChunks,
  getDeleteOperation,
  getIndexOperation,
  performBulkOperations
} from "../utils";

const bulk = jest.fn();
const client = {
  bulk
} as unknown as Client;

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("getChunks", () => {
  it("should default chunk size to 300 if not provided", () => {
    const items = [...Array(400).keys()].map(() => {});
    const chunks = getChunks(items);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(300);
    expect(chunks[1]).toHaveLength(100);
  });

  it("should chunk items by given size", () => {
    const items = [...Array(400).keys()].map(() => {});
    const chunks = getChunks(items, 100);
    expect(chunks).toHaveLength(4);
    expect(chunks[0]).toHaveLength(100);
    expect(chunks[1]).toHaveLength(100);
    expect(chunks[2]).toHaveLength(100);
    expect(chunks[3]).toHaveLength(100);
  });
});

describe("getIndexOperation", () => {
  it("should return a tuple for indexing", () => {
    const item = { id: "id", some: "value" };
    const indexOperation = getIndexOperation("index-name", item, item.id);
    expect(indexOperation).toEqual([
      { index: { _index: "index-name", _id: item.id } },
      item
    ]);
  });
});

describe("getDeleteOperation", () => {
  it("should return a single value array for deleting", () => {
    const item = { id: "id", some: "value" };
    const indexOperation = getDeleteOperation("index-name", item.id);
    expect(indexOperation).toEqual([
      { delete: { _index: "index-name", _id: item.id } }
    ]);
  });
});

describe("performBulkOperations", () => {
  it("should throw error when bulk throws error", async () => {
    const indexName = "index-name";
    const itemId = "id";
    bulk.mockRejectedValueOnce(Error("Expected error"));
    const bulkOperations = [[{ delete: { _index: indexName, _id: itemId } }]];

    try {
      await performBulkOperations(client, bulkOperations, "index-name");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(bulk).toHaveBeenCalledWith({
      index: indexName,
      refresh: true,
      body: bulkOperations[0]
    });
  });

  it("should handle bulk returning index errors", async () => {
    const indexName = "index-name";
    const itemId = "id";
    const item = { id: itemId, some: "value" };
    const bulkApiResponse: BulkApiResponse = {
      body: {
        errors: true,
        items: [
          {
            index: {
              _index: indexName,
              _type: "_type",
              _id: itemId,
              _version: 0,
              result: "result",
              _shards: {
                total: 1,
                successful: 0,
                failed: 1
              },
              status: 404,
              _seq_no: 1,
              _primary_term: 0,
              error: {
                name: "error name",
                message: "internal server error",
                meta: {} as ApiResponse,
                body: { code: "500" },
                statusCode: 500,
                headers: {}
              }
            }
          }
        ]
      }
    };
    bulk.mockResolvedValueOnce(bulkApiResponse);
    const bulkOperations = [
      [{ index: { _index: indexName, _id: itemId } }, item]
    ];

    await performBulkOperations(client, bulkOperations, indexName);

    expect(bulk).toHaveBeenCalledWith({
      index: indexName,
      refresh: true,
      body: bulkOperations[0]
    });
  });

  it("should handle bulk returning delete errors", async () => {
    const indexName = "index-name";
    const itemId = "id";
    const bulkApiResponse: BulkApiResponse = {
      body: {
        errors: true,
        items: [
          {
            delete: {
              _index: indexName,
              _type: "_type",
              _id: itemId,
              _version: 0,
              result: "result",
              _shards: {
                total: 1,
                successful: 0,
                failed: 1
              },
              status: 404,
              _seq_no: 1,
              _primary_term: 0,
              error: {
                name: "error name",
                message: "internal server error",
                meta: {} as ApiResponse,
                body: { code: "500" },
                statusCode: 500,
                headers: {}
              }
            }
          }
        ]
      }
    };
    bulk.mockResolvedValueOnce(bulkApiResponse);
    const bulkOperations = [[{ delete: { _index: indexName, _id: itemId } }]];

    await performBulkOperations(client, bulkOperations, indexName);

    expect(bulk).toHaveBeenCalledWith({
      index: indexName,
      refresh: true,
      body: bulkOperations[0]
    });
  });

  it("should handle bulk request", async () => {
    const indexName = "index-name";
    const itemId = "id";
    const item = { id: itemId, some: "value" };
    const bulkApiResponse: BulkApiResponse = {
      body: {
        errors: false,
        items: [
          {
            index: {
              _index: indexName,
              _type: "_type",
              _id: itemId,
              _version: 0,
              result: "result",
              _shards: {
                total: 1,
                successful: 1,
                failed: 0
              },
              status: 200,
              _seq_no: 1,
              _primary_term: 0
            }
          }
        ]
      }
    };
    bulk.mockResolvedValueOnce(bulkApiResponse);
    const bulkOperations = [
      [
        { index: { _index: indexName, _id: itemId } },
        item,
        { delete: { _index: indexName, _id: "id2" } }
      ]
    ];

    await performBulkOperations(client, bulkOperations, indexName);

    expect(bulk).toHaveBeenCalledWith({
      index: indexName,
      refresh: true,
      body: bulkOperations[0]
    });
  });

  it("should handle multiple bulk requests", async () => {
    const indexName = "index-name";
    const itemId = "id";
    const item = { id: itemId, some: "value" };
    const bulkApiResponse: BulkApiResponse = {
      body: {
        errors: false,
        items: [
          {
            index: {
              _index: indexName,
              _type: "_type",
              _id: itemId,
              _version: 0,
              result: "result",
              _shards: {
                total: 1,
                successful: 1,
                failed: 0
              },
              status: 200,
              _seq_no: 1,
              _primary_term: 0
            }
          }
        ]
      }
    };
    bulk
      .mockResolvedValueOnce(bulkApiResponse)
      .mockResolvedValueOnce(bulkApiResponse);
    const bulkOperations = [
      [
        { index: { _index: indexName, _id: itemId } },
        item,
        { delete: { _index: indexName, _id: "id2" } }
      ],
      [
        { index: { _index: indexName, _id: "id3" } },
        item,
        { delete: { _index: indexName, _id: "id4" } }
      ]
    ];

    await performBulkOperations(client, bulkOperations, indexName);

    expect(bulk).toHaveBeenNthCalledWith(1, {
      index: indexName,
      refresh: true,
      body: bulkOperations[0]
    });
    expect(bulk).toHaveBeenNthCalledWith(2, {
      index: indexName,
      refresh: true,
      body: bulkOperations[1]
    });
  });
});
