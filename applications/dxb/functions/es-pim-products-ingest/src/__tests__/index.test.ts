import {
  createProduct as createEsProduct,
  createSystem as createEsSystem,
  Product as EsProduct,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import {
  DeleteItemType,
  ItemType,
  ObjType
} from "@bmi/gcp-pim-message-handler";
import {
  createProduct as createPimProduct,
  createSystem as createPimSystem,
  Product,
  System
} from "@bmi/pim-types";
import { RequestParams } from "@elastic/elasticsearch";
import mockConsole from "jest-mock-console";
import { buildEsProducts, buildEsSystems } from "../index";
import { DeleteMessage, ProductMessage, SystemMessage } from "../types";

const createEvent = (
  message?: ProductMessage | SystemMessage | DeleteMessage
): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};
const createContext = (): {
  message: { data: ProductMessage | SystemMessage };
} => ({
  message: { data: {} as ProductMessage }
});

const getEsClient = jest.fn();
const ping = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});

const transformProduct = jest.fn();
jest.mock("../transformProducts", () => ({
  transformProduct: (product: Product): EsProduct[] => transformProduct(product)
}));

const transformSystem = jest.fn();
jest.mock("../transformSystems", () => ({
  transformSystem: (system: System): EsSystem => transformSystem(system)
}));

const deleteESItemByCode = jest.fn();
jest.mock("../deleteESItemByCode", () => ({
  deleteESItemByCode: (items: DeleteItemType[], type: string) =>
    deleteESItemByCode(items, type)
}));
const updateElasticSearch = jest.fn();
jest.mock("../elasticsearch", () => ({
  updateElasticSearch: (
    itemType: ItemType,
    esProducts: readonly (EsProduct | EsSystem)[]
  ) => updateElasticSearch(itemType, esProducts)
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

const handleMessage = async (
  event: { data: string },
  context: {
    message: {
      data: ProductMessage | SystemMessage | DeleteMessage;
    };
  }
): Promise<any> => (await import("../index")).handleMessage(event, context);

describe("handleMessage", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await handleMessage(createEvent(), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
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

  it("should execute updateElasticSearch function if type of message is 'UPDATED'-'PRODUCTS'", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([createEsProduct()]);

    const message: ProductMessage = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    await handleMessage(createEvent(message), createContext());

    const expectedVariant = buildEsProducts([createPimProduct()]);

    expect(updateElasticSearch).toBeCalledWith("PRODUCTS", expectedVariant);
  });

  it("should execute updateElasticSearch function if type of message is 'UPDATED'-'SYSTEMS'", async () => {
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([createEsSystem()]);

    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createPimSystem()]
    };
    await handleMessage(createEvent(message), createContext());

    const expectedVariant = buildEsSystems([createPimSystem()]);

    expect(updateElasticSearch).toBeCalledWith("SYSTEMS", expectedVariant);
  });

  describe("delete operation", () => {
    const createContext = (): {
      message: { data: DeleteMessage };
    } => ({
      message: { data: {} as DeleteMessage }
    });
    it("should perform delete operation if item's code provided on delete message ", async () => {
      ping.mockImplementation((args) => {
        args();
      });
      const deleteItem: DeleteItemType = {
        code: "test",
        objType: ObjType.Base_product
      };
      const message: DeleteMessage = {
        type: "DELETED",
        itemType: "PRODUCTS",
        items: [deleteItem]
      };

      await handleMessage(createEvent(message), createContext());

      expect(getEsClient).toBeCalled();
      expect(ping).toBeCalled();

      expect(deleteESItemByCode).toBeCalledWith([deleteItem], "PRODUCTS");
    });
  });
});
