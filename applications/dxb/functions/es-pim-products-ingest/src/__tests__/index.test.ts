import {
  createPimProductDocument,
  createPimSystemDocument,
  createProduct as createEsProduct,
  createSystem as createEsSystem,
  // PimDocument as EsPimDocument,
  // PimDocument,
  // PimLinkDocument as EsPimLinkDocument,
  // PimLinkDocument,
  PimProductDocument,
  PimSystemDocument,
  Product as EsProduct,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import { Product, System } from "@bmi/pim-types";
import {
  createDeleteProductMessage,
  createUpdateCategoryMessage,
  createUpdateProductMessage,
  createUpdateSystemMessage,
  DeleteItem,
  ItemType,
  Message
} from "@bmi/pub-sub-types";
import mockConsole from "jest-mock-console";

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
    item: Product[] | System[],
    locale: string,
    tag?: string
  ): (PimProductDocument | PimSystemDocument)[] =>
    transformDocuments(item, locale, tag)
}));

const deleteEsItemByCode = jest.fn();
jest.mock("../deleteEsItemByCode", () => ({
  deleteEsItemByCode: (items: DeleteItem[], type: string) =>
    deleteEsItemByCode(items, type)
}));
const updateItems = jest.fn();
const updateDocuments = jest.fn();
jest.mock("../elasticsearch", () => ({
  updateItems: (
    itemType: ItemType,
    esProducts: readonly (EsProduct | EsSystem)[]
  ) => updateItems(itemType, esProducts),
  updateDocuments: (
    assets: readonly (PimProductDocument | PimSystemDocument)[],
    itemCode: string
  ) => updateDocuments(assets, itemCode)
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.MARKET_LOCALE = "en-US";
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
  it("should throw error if MARKET_LOCALE is not set", async () => {
    const originalMarketLocale = process.env.MARKET_LOCALE;
    delete process.env.MARKET_LOCALE;

    const message = createDeleteProductMessage();

    try {
      await handleMessage(createEvent(message), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "MARKET_LOCALE has not been set."
      );
    }

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();

    process.env.MARKET_LOCALE = originalMarketLocale;
  });

  it("should do nothing if event data is empty", async () => {
    await handleMessage(createEvent(), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should do nothing if itemType is CATEGORIES", async () => {
    const message = createUpdateCategoryMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should throw error if deleteEsItemByCode throws error", async () => {
    deleteEsItemByCode.mockRejectedValueOnce(Error("Expected error"));

    const message = createDeleteProductMessage();

    try {
      await handleMessage(createEvent(message), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteEsItemByCode).toBeCalledWith(message.item, message.itemType);
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should delete item", async () => {
    const message = createDeleteProductMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).toBeCalledWith(message.item, message.itemType);
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should do nothing if transform product returns empty array", async () => {
    transformProduct.mockReturnValue([]);

    const message = createUpdateProductMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).toBeCalledWith(message.item);
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should do nothing if transform system returns undefined", async () => {
    transformSystem.mockReturnValue(undefined);

    const message = createUpdateSystemMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).toBeCalledWith(message.item);
    expect(transformDocuments).not.toBeCalled();
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should update Elasticsearch with only transformed products if no documents found", async () => {
    const transformedProducts = [createEsProduct()];
    transformProduct.mockReturnValue(transformedProducts);
    transformDocuments.mockResolvedValueOnce([]);

    const message = createUpdateProductMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).toBeCalledWith(message.item);
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(updateItems).toBeCalledWith("PRODUCTS", transformedProducts);
    expect(updateDocuments).not.toBeCalled();
  });

  it("should update Elasticsearch with only transformed sytems if no documents found", async () => {
    const transformedSystems = createEsSystem();
    transformSystem.mockReturnValue(transformedSystems);
    transformDocuments.mockResolvedValueOnce([]);

    const message = createUpdateSystemMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).toBeCalledWith(message.item);
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(updateItems).toBeCalledWith("SYSTEMS", [transformedSystems]);
    expect(updateDocuments).not.toBeCalled();
  });

  it("should throw error when transformDocuments throws error", async () => {
    const transformedProducts = [createEsProduct()];
    transformProduct.mockReturnValue(transformedProducts);
    transformDocuments.mockRejectedValueOnce(Error("Expected error"));

    const message = createUpdateProductMessage();

    try {
      await handleMessage(createEvent(message), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).toBeCalledWith(message.item);
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(updateItems).not.toBeCalled();
    expect(updateDocuments).not.toBeCalled();
  });

  it("should update Elasticsearch with transformed products and documents if documents found", async () => {
    const transformedProducts = [createEsProduct()];
    const transformedDocuments = [createPimProductDocument()];
    transformProduct.mockReturnValue(transformedProducts);
    transformDocuments.mockResolvedValueOnce(transformedDocuments);

    const message = createUpdateProductMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).toBeCalledWith(message.item);
    expect(transformSystem).not.toBeCalled();
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(updateItems).toBeCalledWith("PRODUCTS", transformedProducts);
    expect(updateDocuments).toBeCalledWith(
      transformedDocuments,
      message.item.code
    );
  });

  it("should update Elasticsearch with transformed sytems and documents if documents found", async () => {
    const transformedSystems = createEsSystem();
    const transformedDocuments = [createPimProductDocument()];
    transformSystem.mockReturnValue(transformedSystems);
    transformDocuments.mockResolvedValueOnce(transformedDocuments);

    const message = createUpdateSystemMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).toBeCalledWith(message.item);
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      undefined
    );
    expect(updateItems).toBeCalledWith("SYSTEMS", [transformedSystems]);
    expect(updateDocuments).toBeCalledWith(
      transformedDocuments,
      message.item.code
    );
  });

  it("should pass TAG to transformDocuments if set", async () => {
    process.env.TAG = "market__belgium";
    const transformedSystems = createEsSystem();
    const transformedDocuments = [createPimSystemDocument()];
    transformSystem.mockReturnValue(transformedSystems);
    transformDocuments.mockResolvedValueOnce(transformedDocuments);

    const message = createUpdateSystemMessage();

    await handleMessage(createEvent(message), createContext());

    expect(deleteEsItemByCode).not.toBeCalled();
    expect(transformProduct).not.toBeCalled();
    expect(transformSystem).toBeCalledWith(message.item);
    expect(transformDocuments).toBeCalledWith(
      message.item,
      process.env.MARKET_LOCALE,
      process.env.TAG
    );
    expect(updateItems).toBeCalledWith("SYSTEMS", [transformedSystems]);
    expect(updateDocuments).toBeCalledWith(
      transformedDocuments,
      message.item.code
    );
    delete process.env.TAG;
  });
});
