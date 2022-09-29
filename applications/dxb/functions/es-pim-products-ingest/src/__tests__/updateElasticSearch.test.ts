import {
  createProduct as createPimProduct,
  createSystem,
  createVariantOption,
  Product,
  System
} from "@bmi/pim-types";
import { ItemType } from "@bmi/pub-sub-types";
import { RequestParams } from "@elastic/elasticsearch";
import { updateElasticSearch } from "../elasticsearch";
import { buildEsProducts, buildEsSystems } from "../index";
import { createPimDocument } from "./helpers/PimDocumentHelper";

const { ES_INDEX_PREFIX, ES_INDEX_NAME_DOCUMENTS } = process.env;

const getEsClient = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
// const deleteByQuery = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: []) => getEsClient(...args) };
});

const getEsTransformedProductDocumentsMock = (product?: Partial<Product>) =>
  buildEsProducts(createPimProduct(product));

const getEsTransformedSystemDocumentsMock = (system?: Partial<System>) =>
  buildEsSystems(createSystem(system));

const productCode = "TEST_CODE_PRODUCT";
const systemCode = "TEST_CODE_SYSTEM";
const documents = [createPimDocument()];

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();

  getEsClient.mockImplementation(() => ({
    bulk: (params: RequestParams.Bulk) => bulk(params),
    count: (params: RequestParams.Count) => count(params)
    // deleteByQuery: (params: RequestParams.DeleteByQuery) =>
    //   deleteByQuery(params)
  }));
});

describe("updateElasticSearch", () => {
  it("should perform a bulk update for approved variants and related documents on updated message", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const documentIndex = `${ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();
    const product = createPimProduct({ code: productCode });
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock(product);

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
    // deleteByQuery.mockResolvedValue({
    //   body: {
    //     status: "OK"
    //   }
    // });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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
    // expect(deleteByQuery).toBeCalledWith({
    //   index: documentIndex,
    //   body: {
    //     query: {
    //       match: {
    //         productBaseCode: productCode
    //       }
    //     }
    //   }
    // });
    expect(bulk).toBeCalledWith({
      index: documentIndex,
      refresh: true,
      body: [
        {
          index: {
            _index: documentIndex,
            _id: documents[0].id
          }
        },
        documents[0]
      ]
    });
    expect(count).toBeCalledWith({ index });
    expect(count).toBeCalledWith({ index: documentIndex });
  });

  it("should NOT perform a bulk update for approved variants on updated message if ES_INDEX_PREFIX is NOT provided", async () => {
    const itemType: ItemType = "PRODUCTS";
    const documentIndex =
      `${process.env.ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();
    const product = createPimProduct({ code: productCode });
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock(product);
    const originalEsIndexprefix = process.env.ES_INDEX_PREFIX;
    delete process.env.ES_INDEX_PREFIX;
    console.log(process.env.ES_INDEX_PREFIX);

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
    // deleteByQuery.mockResolvedValue({
    //   body: {
    //     status: "OK"
    //   }
    // });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
    );

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledTimes(1);
    // expect(deleteByQuery).toBeCalledWith({
    //   index: documentIndex,
    //   body: {
    //     query: {
    //       match: {
    //         productBaseCode: productCode
    //       }
    //     }
    //   }
    // });
    expect(bulk).toBeCalledWith({
      index: documentIndex,
      refresh: true,
      body: [
        {
          index: {
            _index: documentIndex,
            _id: documents[0].id
          }
        },
        documents[0]
      ]
    });
    expect(count).toBeCalledWith({ index: documentIndex });
    process.env.ES_INDEX_PREFIX = originalEsIndexprefix;
  });

  it("should NOT perform a bulk update for documents on updated message if ES_INDEX_NAME_DOCUMENTS is NOT provided", async () => {
    const itemType: ItemType = "PRODUCTS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const product = createPimProduct({ code: productCode });
    const esTransformedProductDocumentsMock =
      getEsTransformedProductDocumentsMock(product);
    const originalEsIndexNameDocuments = process.env.ES_INDEX_NAME_DOCUMENTS;
    delete process.env.ES_INDEX_NAME_DOCUMENTS;

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
    // deleteByQuery.mockResolvedValue({
    //   body: {
    //     status: "OK"
    //   }
    // });

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
    );

    expect(getEsClient).toBeCalled();
    expect(bulk).toBeCalledTimes(1);
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
    // expect(deleteByQuery).not.toBeCalled();

    expect(count).toBeCalledWith({ index });
    process.env.ES_INDEX_NAME_DOCUMENTS = originalEsIndexNameDocuments;
  });

  it("should perform a bulk update for approved systems and related documents on updated message", async () => {
    const itemType: ItemType = "SYSTEMS";
    const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
    const documentIndex = `${ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();
    const system = createSystem({ code: systemCode });
    const esTransformedSystemDocumentsMock =
      getEsTransformedSystemDocumentsMock(system);
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
    // deleteByQuery.mockResolvedValue({
    //   body: {
    //     status: "OK"
    //   }
    // });

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );

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
    // expect(deleteByQuery).toBeCalledWith({
    //   index: documentIndex,
    //   body: {
    //     query: {
    //       match: {
    //         productBaseCode: systemCode
    //       }
    //     }
    //   }
    // });
    expect(bulk).toBeCalledWith({
      index: documentIndex,
      refresh: true,
      body: [
        {
          index: {
            _index: documentIndex,
            _id: documents[0].id
          }
        },
        documents[0]
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

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );

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

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );

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
      documents,
      productCode,
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

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );
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

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );

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

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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

    await updateElasticSearch(
      itemType,
      esTransformedSystemDocumentsMock,
      documents,
      systemCode
    );

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
    bulk.mockResolvedValueOnce({
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

    await updateElasticSearch(
      itemType,
      esTransformedProductDocumentsMock,
      documents,
      productCode
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
    bulk.mockResolvedValueOnce({
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
      documents,
      productCode,
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
      documents,
      productCode,
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
