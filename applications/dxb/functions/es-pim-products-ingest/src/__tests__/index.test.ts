import { RequestParams } from "@elastic/elasticsearch";
import mockConsole from "jest-mock-console";
import { ProductVariant } from "../es-model";
import { Product, System } from "../pim";
import { ProductMessage, SystemMessage } from "../types";
import { EsSystem } from "../transformSystems";
import createProductVariant from "./helpers/ProductVariantHelper";
import createPimProduct from "./helpers/PimProductHelper";
import { createEsSystem } from "./helpers/EsSystemHelper";
import createSystem from "./helpers/SystemHelper";

const { ES_INDEX_PREFIX } = process.env;

const createEvent = (
  message?: ProductMessage | SystemMessage
): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};
const createContext = (): { message: { data: object } } => ({
  message: { data: {} }
});

const getEsClient = jest.fn();
const ping = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
jest.mock("../es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});

const transformProduct = jest.fn();
jest.mock("../transformProducts", () => ({
  transformProduct: (product: Product): ProductVariant[] =>
    transformProduct(product)
}));

const transformSystem = jest.fn();
jest.mock("../transformSystems", () => ({
  transformSystem: (system: System): EsSystem => transformSystem(system)
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();

  getEsClient.mockImplementation(() => ({
    ping: (callback: () => any) => ping(callback),
    bulk: (params: RequestParams.Bulk) => bulk(params),
    count: (params: RequestParams.Count) => count(params)
  }));
});

const handleMessage = (
  event: { data: string },
  context: {
    message: {
      data: object;
    };
  }
): Promise<any> => require("../index").handleMessage(event, context);

describe("handleMessage", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await handleMessage(createEvent(), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalledTimes(0);
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if ES cluster is not available", async () => {
    ping.mockImplementation((args) => {
      args({});
    });

    await handleMessage(createEvent(), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if event data is empty", async () => {
    ping.mockImplementation((args) => {
      args();
    });

    await handleMessage(createEvent(), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform product returns empty array", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([]);

    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns transformed products but type is invalid", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([createProductVariant()]);

    const message: ProductMessage = {
      type: "INVALID",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns transformed systems but type is invalid", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    transformSystem.mockReturnValue(createEsSystem());

    const message: SystemMessage = {
      type: "INVALID",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should perform a bulk update for approved variants on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { index: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk update for approved systems on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem();
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ index: { _index: index, _id: esSystem.code } }, esSystem]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check variants on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({ approvalStatus: "check" });
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check systems on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({ approvalStatus: "check" });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved variants on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({
      approvalStatus: "unapproved"
    });
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved systems on updated message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({
      approvalStatus: "unapproved"
    });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for approved variants on delete message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for approved systems on delete message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem();
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check variants on deleted message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({ approvalStatus: "check" });
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check systems on deleted message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({ approvalStatus: "check" });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved variants on deleted message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({
      approvalStatus: "unapproved"
    });
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved systems on deleted message", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({
      approvalStatus: "unapproved"
    });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should handle errors being returned for update", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { index: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should handle errors being returned for delete", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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
                index_uuid: productVariant.code,
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should handle errors when elasticsearch doesn't return error details", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message: ProductMessage = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
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

    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });
});
