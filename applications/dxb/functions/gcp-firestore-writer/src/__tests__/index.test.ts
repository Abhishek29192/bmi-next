import { ObjType } from "@bmi/gcp-pim-message-handler";
import {
  DocumentReference,
  Firestore,
  CollectionReference
} from "@bmi/functions-firestore";
import { handleMessage, CODE_TYPES, OBJECT_TYPES } from "../";

const createEvent = (message = {}) => {
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

describe("handleMessage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should execute correctly if type is UPDATED and itemType is PRODUCTS", async () => {
    const item = {
      name: "Test Product 1",
      code: "BaseProduct",
      variantOptions: [{ code: "VariantOption" }]
    };
    const data = createEvent({
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [item]
    });

    const updatedItem = {
      ...item,
      [CODE_TYPES.VARIANT_CODES]: item.variantOptions.map(
        (obj: any) => obj.code
      )
    };

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, updatedItem);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is SYSTEMS", async () => {
    const item = {
      name: "Test System 1",
      code: "System",
      systemLayers: [{ code: "SystemLayer" }]
    };
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [item]
    });

    const updatedItem = {
      ...item,
      [CODE_TYPES.LAYER_CODES]: item.systemLayers.map((obj: any) => obj.code)
    };

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, updatedItem);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and system do not have layers", async () => {
    const item = {
      name: "Test System 1",
      code: "System"
    };
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [item]
    });

    doc.mockReturnValue(documentRef);

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, item);
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

    doc.mockReturnValue(documentRef);

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, item);
    expect(commit).toBeCalledTimes(1);
  });
  it("should execute correctly if type is DELETED and objType is 'base_product'", async () => {
    const docRef1 = { ...documentRef, id: "docId1" };
    const docRef2 = { ...documentRef, id: "docId2" };
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    doc.mockReturnValueOnce(docRef1).mockReturnValueOnce(docRef2);

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(2);
    expect(deleteFunc).toHaveBeenNthCalledWith(1, docRef1);
    expect(deleteFunc).toHaveBeenNthCalledWith(2, docRef2);
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

    const mockedRosolvedValue = {
      code: "Base_Product_code",
      variantOptions: [
        { code: "Test_Variant_1" },
        { code: "Test_Variant_3" },
        { code: "Test_Variant_4" }
      ],
      variantCodes: ["Test_Variant_1", "Test_Variant_3", "Test_Variant_4"]
    };

    get.mockResolvedValue({
      docs: [
        {
          data: () => mockedRosolvedValue
        }
      ]
    });

    doc.mockReturnValue(documentRef);

    const updatedObjType = [
      { code: "Test_Variant_3" },
      { code: "Test_Variant_4" }
    ];

    const updatedDocument = {
      ...mockedRosolvedValue,
      [OBJECT_TYPES.VARIANT_OPTIONS]: updatedObjType,
      [CODE_TYPES.VARIANT_CODES]: updatedObjType.map((obj: any) => obj.code)
    };

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(documentRef, updatedDocument);
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

  it("should throw error if type is unrecognised", async () => {
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "TEST",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    let actualErrorMsg;
    try {
      await handleMessage(data, {});
    } catch (e) {
      actualErrorMsg = (e as Error).message;
    }
    const expectedErrorMsg = `Unrecognised message type [TEST]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it("should throw error if itemType is unrecognised", async () => {
    const data = createEvent({
      itemType: "TEST",
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    let actualErrorMsg;
    try {
      await handleMessage(data, {});
    } catch (e) {
      actualErrorMsg = (e as Error).message;
    }
    const expectedErrorMsg = `Unrecognised itemType [TEST]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it("should return empty object if data is not received", async () => {
    let actualErrorMsg;
    try {
      await handleMessage({ data: "" }, {});
    } catch (e) {
      actualErrorMsg = (e as Error).message;
    }
    const expectedErrorMsg = `Unrecognised itemType [undefined]`;
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });
});
