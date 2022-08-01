import {
  CollectionReference,
  DocumentReference,
  Firestore
} from "@bmi/functions-firestore";
import { createFullyPopulatedProduct, createSystem } from "@bmi/pim-types";
import {
  createDeleteProductItem,
  createDeleteProductMessage,
  createDeleteSystemItem,
  createDeleteSystemMessage,
  createUpdateCategoryMessage,
  createUpdateProductMessage,
  createUpdateSystemMessage,
  Message,
  ObjType
} from "@bmi/pub-sub-types";
import { CODE_TYPES, handleMessage, OBJECT_TYPES } from "../";

jest.mock("@bmi-digital/functions-logger");

const createEvent = (message?: Message) => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};

const set = jest.fn();
const commit = jest.fn();
const deleteFunc = jest.fn();
const get = jest.fn();
const doc = jest.fn();
const documentRef: DocumentReference = {
  id: "docId",
  firestore: {} as Firestore,
  parent: {} as CollectionReference,
  path: "path",
  collection: jest.fn(),
  listCollections: jest.fn(),
  create: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
  onSnapshot: jest.fn(),
  isEqual: jest.fn(),
  withConverter: jest.fn()
};

jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get
      }))
    })),
    doc: () => doc(),
    batch: jest.fn(() => ({
      set,
      commit,
      delete: deleteFunc
    }))
  }))
}));

const transformProduct = jest.fn();
jest.mock("../productTransformer", () => ({
  transformProduct: () => transformProduct()
}));

const transformSystem = jest.fn();
jest.mock("../systemTransformer", () => ({
  transformSystem: () => transformSystem()
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("handleMessage", () => {
  it("should execute correctly if type is UPDATED and itemType is PRODUCTS", async () => {
    const product = createFullyPopulatedProduct();
    const data = createEvent(
      createUpdateProductMessage({
        item: product
      })
    );

    const transformedProduct = {
      baseCode: product.code,
      code: product.variantOptions![0].code
    };
    transformProduct.mockReturnValue([transformedProduct]);

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, transformedProduct);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is SYSTEMS", async () => {
    const item = createSystem();
    const data = createEvent(
      createUpdateSystemMessage({
        item
      })
    );

    const transformedSystem = {
      ...item,
      layerCodes: item.systemLayers!.map((layer) => layer.code)
    };
    transformSystem.mockReturnValue([transformedSystem]);

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, transformedSystem);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and system do not have layers", async () => {
    const item = createSystem({ systemLayers: undefined });
    const data = createEvent(
      createUpdateSystemMessage({
        item
      })
    );

    const transformedSystem = {
      ...item,
      layerCodes: []
    };
    transformSystem.mockReturnValue([transformedSystem]);

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, transformedSystem);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is CATEGORIES", async () => {
    const item = {
      name: "Test Category 1"
    };
    const data = createEvent(
      createUpdateCategoryMessage({
        item
      })
    );

    await handleMessage(data, {});

    expect(set).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });

  it("should execute correctly if type is DELETED and objType is 'base_product'", async () => {
    const doc1 = { exists: true, ref: { ...documentRef, id: "docId1" } };
    const data = createEvent(
      createDeleteProductMessage({
        item: createDeleteProductItem({
          code: "BP1",
          objType: ObjType.Base_product
        })
      })
    );

    get.mockResolvedValueOnce({ docs: [doc1] });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith(doc1.ref);
    expect(commit).toBeCalledTimes(1);
  });

  it("should NOT delete 'base_product' if it is not exists in firestore", async () => {
    const doc1 = { exists: false, ref: { ...documentRef, id: "docId1" } };
    const data = createEvent(
      createDeleteProductMessage({
        item: createDeleteProductItem({
          code: "BP1",
          objType: ObjType.Base_product
        })
      })
    );

    get.mockResolvedValueOnce({ docs: [doc1] });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(0);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is DELETED and objType is 'system'", async () => {
    const docRef1 = { ...documentRef, id: "docId1" };
    const data = createEvent(
      createDeleteSystemMessage({
        itemType: "SYSTEMS",
        type: "DELETED",
        item: createDeleteSystemItem({ code: "BS1", objType: ObjType.System })
      })
    );

    doc.mockReturnValueOnce(docRef1);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith(docRef1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete variant if objType is 'variant'", async () => {
    const data = createEvent(
      createDeleteProductMessage({
        item: createDeleteProductItem({
          code: "Test_Variant_1",
          objType: ObjType.Variant
        })
      })
    );
    const docRef1 = { ...documentRef, id: "docId1" };

    doc.mockReturnValue(docRef1);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toBeCalledWith(docRef1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete system layer if objType is 'layer'", async () => {
    const data = createEvent(
      createDeleteSystemMessage({
        item: createDeleteSystemItem({
          code: "Test_Layer_1",
          objType: ObjType.Layer
        })
      })
    );

    const mockedRosolvedValue = {
      code: "System_code",
      systemLayers: [
        { code: "Test_Layer_1" },
        { code: "Test_Layer_3" },
        { code: "Test_Layer_4" }
      ],
      layerCodes: ["Test_Layer_1", "Test_Layer_3", "Test_Layer_4"]
    };

    get.mockResolvedValue({
      docs: [
        {
          data: () => mockedRosolvedValue
        }
      ]
    });

    doc.mockReturnValue(documentRef);

    const updatedObjType = [{ code: "Test_Layer_3" }, { code: "Test_Layer_4" }];

    const updatedDocument = {
      ...mockedRosolvedValue,
      [OBJECT_TYPES.SYSTEM_LAYERS]: updatedObjType,
      [CODE_TYPES.LAYER_CODES]: updatedObjType.map((obj: any) => obj.code)
    };

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, updatedDocument);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete base product if only one variant is present", async () => {
    const data = createEvent(
      createDeleteProductMessage({
        item: createDeleteProductItem({
          code: "Test_Variant_1",
          objType: ObjType.Variant
        })
      })
    );

    get.mockResolvedValue({
      docs: [
        {
          data: () => ({
            code: "Base_Product_code",
            variantOptions: [{ code: "Test_Variant_1" }]
          })
        }
      ]
    });

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toBeCalledWith(documentRef);
    expect(commit).toBeCalledTimes(1);
  });

  it("should NOT delete system if only one layer is present", async () => {
    const data = createEvent(
      createDeleteSystemMessage({
        item: createDeleteSystemItem({
          code: "Test_Layer_1",
          objType: ObjType.Layer
        })
      })
    );

    get.mockResolvedValue({
      docs: [
        {
          data: () => ({
            code: "System_code",
            systemLayers: [{ code: "Test_Layer_1" }],
            layerCodes: ["Test_Layer_1"]
          })
        }
      ]
    });

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(0);
    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, {
      code: "System_code",
      systemLayers: [],
      layerCodes: []
    });
    expect(commit).toBeCalledTimes(1);
  });

  it("should NOT update system if only data layer to delete does not exist", async () => {
    const data = createEvent(
      createDeleteSystemMessage({
        item: createDeleteSystemItem({
          code: "Test_Layer_1",
          objType: ObjType.Layer
        })
      })
    );

    get.mockResolvedValue({
      docs: []
    });

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(0);
    expect(set).toBeCalledTimes(0);
    expect(commit).toBeCalledTimes(1);
  });

  it("should throw error if type is unrecognised", async () => {
    const data = createEvent(
      createUpdateProductMessage({
        type: "TEST" as any
      })
    );

    let actualErrorMsg;
    try {
      await handleMessage(data, {});
    } catch (error) {
      actualErrorMsg = (error as Error).message;
    }
    const expectedErrorMsg = `Unrecognised message type [TEST]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it("should throw error if itemType is unrecognised", async () => {
    const data = createEvent(
      createUpdateProductMessage({
        itemType: "TEST" as any
      })
    );

    let actualErrorMsg;
    try {
      await handleMessage(data, {});
    } catch (error) {
      actualErrorMsg = (error as Error).message;
    }
    const expectedErrorMsg = `Unrecognised itemType [TEST]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it("should return empty object if data is not received", async () => {
    let actualErrorMsg;
    try {
      await handleMessage({ data: "" }, {});
    } catch (error) {
      actualErrorMsg = (error as Error).message;
    }
    const expectedErrorMsg = `Unrecognised itemType [undefined]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });
});
