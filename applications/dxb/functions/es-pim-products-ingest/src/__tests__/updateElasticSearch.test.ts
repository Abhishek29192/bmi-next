import {
  createProduct as createPimProduct,
  createSystem
} from "@bmi/pim-types";
import { RequestParams } from "@elastic/elasticsearch";
import { ItemType } from "@bmi/gcp-pim-message-handler";
import { Product, System, createVariantOption } from "@bmi/pim-types";
import { buildEsProducts, buildEsSystems } from "../index";
import { updateElasticSearch } from "../elasticsearch";

const { ES_INDEX_PREFIX } = process.env;

const getEsClient = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});

const getEsTransformedProductDocumentsMock = (product?: Partial<Product>) =>
  buildEsProducts([createPimProduct(product)]);

const getEsTransformedSystemDocumentsMock = (system?: Partial<System>) =>
  buildEsSystems([createSystem(system)]);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();

  getEsClient.mockImplementation(() => ({
    bulk: (params: RequestParams.Bulk) => bulk(params),
    count: (params: RequestParams.Count) => count(params)
  }));
});

describe("", () => {
  it("should perform a bulk update for approved variants on updated message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          index: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        },
        esTransformedProductDocumentsMock[0]
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk update for approved systems on updated message", async () => {
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock();

    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          index: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        },
        esTransformedSystemDocumentsMock[0]
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for check variants on updated message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock({
        variantOptions: [createVariantOption({ approvalStatus: "check" })]
      });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for check systems on updated message", async () => {
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock({ approvalStatus: "check" });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for unapproved variants on updated message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock({
        variantOptions: [createVariantOption({ approvalStatus: "unapproved" })]
      });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for unapproved systems on updated message", async () => {
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock({ approvalStatus: "unapproved" });
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for approved variants on delete message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock();
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      "delete"
    );

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for approved systems on delete message", async () => {
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock({ approvalStatus: "unapproved" });
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);
    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for check variants on deleted message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock({
        variantOptions: [createVariantOption({ approvalStatus: "check" })]
      });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for check systems on deleted message", async () => {
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock({ approvalStatus: "check" });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for unapproved variants on deleted message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock({
        variantOptions: [createVariantOption({ approvalStatus: "unapproved" })]
      });
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);
    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should perform a bulk delete for unapproved systems on deleted message", async () => {
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock({ approvalStatus: "unapproved" });
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedSystemDocumentsMock);

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedSystemDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
  it("should handle errors being returned for update", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock();
    bulk.mockResolvedValue({
      body: {
        errors: true,
        items: [
          {
            index: {
              status: 400,
              error: {
                type: "document_missing_exception",
                reason: "[_doc][6]: document missing",
                index_uuid: "aAsFqTI0Tc2W0LCWgPNrOA",
                shard: "0",
                index: "index1"
              }
            }
          }
        ]
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(itemType, esTransformedProductDocumentsMock);

    const indexingError = consoleSpy.mock.calls.filter((item) =>
      item[0].includes("Failed to index")
    );

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          index: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        },
        esTransformedProductDocumentsMock[0]
      ]
    });
    expect(indexingError).toHaveLength(1);
    expect(count).toBeCalledWith({ index });
  });
  it("should handle errors being returned for delete", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock();
    bulk.mockResolvedValue({
      body: {
        errors: true,
        items: [
          {
            delete: {
              status: 400,
              error: {
                type: "document_missing_exception",
                reason: "[_doc][6]: document missing",
                index_uuid: esTransformedProductDocumentsMock[0].code,
                shard: "0",
                index: index
              }
            }
          }
        ]
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      "delete"
    );

    const indexingError = consoleSpy.mock.calls.filter((item) =>
      item[0].includes("Failed to index")
    );

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(indexingError).toHaveLength(1);
    expect(count).toBeCalledWith({ index });
  });
  it("should handle errors when elasticsearch doesn't return error details", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock();
    bulk.mockResolvedValue({
      body: {
        errors: true,
        items: [
          {
            index: {
              status: 400
            }
          },
          {
            delete: {
              status: 400
            }
          }
        ]
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      "delete"
    );
    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        {
          delete: {
            _index: index,
            _id: esTransformedProductDocumentsMock[0].code
          }
        }
      ]
    });
    expect(count).toBeCalledWith({ index });
  });
});
