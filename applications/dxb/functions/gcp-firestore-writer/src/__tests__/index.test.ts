import {
  CollectionReference,
  DocumentReference,
  Firestore
} from "@bmi/functions-firestore";
import { ObjType } from "@bmi/gcp-pim-message-handler";
import { createFullyPopulatedProduct, createSystem } from "@bmi/pim-types";
import { CODE_TYPES, handleMessage, Message, OBJECT_TYPES } from "../";

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

const transformProducts = jest.fn();
jest.mock("../productTransformer", () => ({
  transformProducts: () => transformProducts()
}));

const transformSystems = jest.fn();
jest.mock("../systemTransformer", () => ({
  transformSystems: () => transformSystems()
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("handleMessage", () => {
  it("should execute correctly if type is UPDATED and itemType is PRODUCTS", async () => {
    const product = createFullyPopulatedProduct();
    const data = createEvent({
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [product]
    });

    const transformedProduct = {
      baseCode: product.code,
      code: product.variantOptions![0].code
    };
    transformProducts.mockReturnValue([transformedProduct]);

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, transformedProduct);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is SYSTEMS", async () => {
    const item = createSystem();
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [item]
    });

    const transformedSystem = {
      ...item,
      layerCodes: item.systemLayers!.map((layer) => layer.code)
    };
    transformSystems.mockReturnValue([transformedSystem]);

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, transformedSystem);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and system do not have layers", async () => {
    const item = createSystem({ systemLayers: undefined });
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [item]
    });

    const transformedSystem = {
      ...item,
      layerCodes: []
    };
    transformSystems.mockReturnValue([transformedSystem]);

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
    const data = createEvent({
      type: "UPDATED",
      itemType: "CATEGORIES",
      items: [item]
    });

    await handleMessage(data, {});

    expect(set).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });

  it("should execute correctly if type is DELETED and objType is 'base_product'", async () => {
    const doc1 = { exists: true, ref: { ...documentRef, id: "docId1" } };
    const doc2 = { exists: true, ref: { ...documentRef, id: "docId2" } };
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    get
      .mockResolvedValueOnce({ docs: [doc1] })
      .mockResolvedValueOnce({ docs: [doc2] });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(2);
    expect(deleteFunc).toHaveBeenNthCalledWith(1, doc1.ref);
    expect(deleteFunc).toHaveBeenNthCalledWith(2, doc2.ref);
    expect(commit).toBeCalledTimes(1);
  });

  it("should NOT delete 'base_product' if it is not exists in firestore", async () => {
    const doc1 = { exists: false, ref: { ...documentRef, id: "docId1" } };
    const doc2 = { exists: true, ref: { ...documentRef, id: "docId2" } };
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    get
      .mockResolvedValueOnce({ docs: [doc1] })
      .mockResolvedValueOnce({ docs: [doc2] });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith(doc2.ref);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is DELETED and objType is 'system'", async () => {
    const docRef1 = { ...documentRef, id: "docId1" };
    const docRef2 = { ...documentRef, id: "docId2" };
    const data = createEvent({
      itemType: "SYSTEMS",
      type: "DELETED",
      items: [
        { code: "BS1", objType: ObjType.System },
        { code: "BS2", objType: ObjType.System }
      ]
    });

    doc.mockReturnValueOnce(docRef1).mockReturnValueOnce(docRef2);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(2);
    expect(deleteFunc).toHaveBeenNthCalledWith(1, docRef1);
    expect(deleteFunc).toHaveBeenNthCalledWith(2, docRef2);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete variant if objType is 'variant'", async () => {
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [{ code: "Test_Variant_1", objType: ObjType.Variant }]
    });
    const docRef1 = { ...documentRef, id: "docId1" };

    doc.mockReturnValue(docRef1);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(deleteFunc).toBeCalledWith(docRef1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete system layer if objType is 'layer'", async () => {
    const data = createEvent({
      itemType: "SYSTEMS",
      type: "DELETED",
      items: [{ code: "Test_Layer_1", objType: ObjType.Layer }]
    });

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
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [{ code: "Test_Variant_1", objType: ObjType.Variant }]
    });

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
    const data = createEvent({
      itemType: "SYSTEMS",
      type: "DELETED",
      items: [{ code: "Test_Layer_1", objType: ObjType.Layer }]
    });

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
    const data = createEvent({
      itemType: "SYSTEMS",
      type: "DELETED",
      items: [{ code: "Test_Layer_1", objType: ObjType.Layer }]
    });

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
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "TEST" as any,
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

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
    const data = createEvent({
      itemType: "TEST" as any,
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

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
