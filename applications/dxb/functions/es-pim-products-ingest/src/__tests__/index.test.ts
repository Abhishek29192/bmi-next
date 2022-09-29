import {
  createProduct as createEsProduct,
  createSystem as createEsSystem,
  EsPIMDocumentData,
  EsPIMLinkDocumentData,
  Product as EsProduct,
  System as EsSystem
} from "@bmi/elasticsearch-types";

import {
  createProduct as createPimProduct,
  createSystem as createPimSystem,
  Product,
  System
} from "@bmi/pim-types";
import {
  createDeleteProductMessage,
  createUpdateProductMessage,
  createUpdateSystemMessage,
  DeleteItem,
  ItemType,
  Message
} from "@bmi/pub-sub-types";
import { RequestParams } from "@elastic/elasticsearch";
import mockConsole from "jest-mock-console";
import { buildEsProducts, buildEsSystems } from "../index";
import { createPimDocument } from "./helpers/PimDocumentHelper";

const createEvent = (message?: Message): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};
const createContext = (): {
  message: { data: Message };
} => ({
  message: { data: {} as Message }
});

const getEsClient = jest.fn();
const ping = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: []) => getEsClient(...args) };
});

const transformProduct = jest.fn();
jest.mock("../transformProducts", () => ({
  transformProduct: (product: Product): EsProduct[] => transformProduct(product)
}));

const transformSystem = jest.fn();
jest.mock("../transformSystems", () => ({
  transformSystem: (system: System): EsSystem => transformSystem(system)
}));

const transformDocuments = jest.fn();
jest.mock("../transformDocuments", () => ({
  transformDocuments: (
    item: Product[] | System[]
  ): (EsPIMDocumentData | EsPIMLinkDocumentData)[] => transformDocuments(item)
}));

const deleteESItemByCode = jest.fn();
jest.mock("../deleteESItemByCode", () => ({
  deleteESItemByCode: (items: DeleteItem[], type: string) =>
    deleteESItemByCode(items, type)
}));
const updateElasticSearch = jest.fn();
jest.mock("../elasticsearch", () => ({
  updateElasticSearch: (
    itemType: ItemType,
    esProducts: readonly (EsProduct | EsSystem)[],
    assets: readonly (EsPIMDocumentData | EsPIMLinkDocumentData)[],
    itemCode: string
  ) => updateElasticSearch(itemType, esProducts, assets, itemCode)
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();

  getEsClient.mockImplementation(() => ({
    ping: (callback: () => void) => ping(callback),
    bulk: (params: RequestParams.Bulk) => bulk(params),
    count: (params: RequestParams.Count) => count(params)
  }));
});

const handleMessage = async (
  event: { data: string },
  context: {
    message: {
      data: Message;
    };
  }
): Promise<void> => (await import("../index")).handleMessage(event, context);

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

    const message = createUpdateProductMessage();
    await handleMessage(createEvent(message), createContext());

    expect(getEsClient).toBeCalled();
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.item);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should execute updateElasticSearch function if type of message is 'UPDATED'-'PRODUCTS'", async () => {
    ping.mockImplementation((args) => Promise.resolve(args));
    transformProduct.mockReturnValue([createEsProduct()]);
    transformDocuments.mockReturnValue([createPimDocument()]);

    const message = createUpdateProductMessage();
    await handleMessage(createEvent(message), createContext());

    const pimProduct = createPimProduct();

    const expectedVariant = buildEsProducts(pimProduct);
    const transformedDocuments = await transformDocuments(pimProduct.assets);

    expect(updateElasticSearch).toBeCalledWith(
      "PRODUCTS",
      expectedVariant,
      transformedDocuments,
      pimProduct.code
    );
  });

  it("should execute updateElasticSearch function with undefined transormed documents", async () => {
    ping.mockImplementation((args) => Promise.resolve(args));
    transformProduct.mockReturnValue([createEsProduct()]);
    transformDocuments.mockReturnValue(undefined);

    const message: Message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      item: createPimProduct()
    };
    await handleMessage(createEvent(message), createContext());

    const pimProduct = createPimProduct();

    const expectedVariant = buildEsProducts(pimProduct);
    const transformedDocuments = await transformDocuments(pimProduct.assets);

    expect(updateElasticSearch).toBeCalledWith(
      "PRODUCTS",
      expectedVariant,
      transformedDocuments,
      pimProduct.code
    );
  });

  it("should execute updateElasticSearch function if type of message is 'UPDATED'-'PRODUCTS' with empty documents array", async () => {
    ping.mockImplementation((args) => Promise.resolve(args));
    transformProduct.mockReturnValue([createPimProduct()]);
    transformDocuments.mockReturnValue([]);

    const message: Message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      item: createPimProduct()
    };
    await handleMessage(createEvent(message), createContext());

    const pimProduct = createPimProduct();

    const expectedVariant = buildEsProducts(pimProduct);
    const transformedDocuments = await transformDocuments(pimProduct.assets);

    expect(updateElasticSearch).toBeCalledWith(
      "PRODUCTS",
      expectedVariant,
      transformedDocuments,
      pimProduct.code
    );
  });

  it("should execute updateElasticSearch function if type of message is 'UPDATED'-'SYSTEMS'", async () => {
    ping.mockImplementation((args) => Promise.resolve(args));
    transformProduct.mockReturnValue([createEsSystem()]);
    transformDocuments.mockReturnValue([createPimDocument()]);

    const message: Message = createUpdateSystemMessage();
    await handleMessage(createEvent(message), createContext());

    const pimSystem = createPimSystem();

    const expectedVariant = buildEsSystems(pimSystem);
    const transformedDocuments = await transformDocuments(pimSystem.assets);

    expect(updateElasticSearch).toBeCalledWith(
      "SYSTEMS",
      expectedVariant,
      transformedDocuments,
      pimSystem.code
    );
  });

  describe("delete operation", () => {
    const createContext = (): {
      message: { data: Message };
    } => ({
      message: { data: {} as Message }
    });
    it("should perform delete operation if item's code provided on delete message ", async () => {
      ping.mockImplementation((args) => Promise.resolve(args));

      const message = createDeleteProductMessage();

      await handleMessage(createEvent(message), createContext());

      expect(getEsClient).toBeCalled();
      expect(ping).toBeCalled();

      expect(deleteESItemByCode).toBeCalledWith(message.item, "PRODUCTS");
    });
  });
});
