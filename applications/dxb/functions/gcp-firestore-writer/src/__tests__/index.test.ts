import { ObjType } from "@bmi/gcp-pim-message-handler";
import { handleMessage } from "../index";

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
jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get
      }))
    })),
    doc: jest.fn(),
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
    const data = createEvent({
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [
        {
          name: "Test Product 1",
          code: "BaseProduct",
          variantOptions: [{ code: "VariantOption" }]
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is SYSTEMS", async () => {
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [
        {
          name: "Test System 1",
          code: "System",
          systemLayers: [{ code: "SystemLayer" }]
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and system do not have layers", async () => {
    const data = createEvent({
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [
        {
          name: "Test System 1",
          code: "System"
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is UPDATED and itemType is CATEGORIES", async () => {
    const data = createEvent({
      type: "UPDATED",
      itemType: "CATEGORIES",
      items: [
        {
          name: "Test Category 1"
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });
  it("should execute correctly if type is DELETED and objType is 'base_product'", async () => {
    const data = createEvent({
      itemType: "PRODUCTS",
      type: "DELETED",
      items: [
        { code: "BP1", objType: ObjType.Base_product },
        { code: "BP2", objType: ObjType.Base_product }
      ]
    });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(2);
    expect(commit).toBeCalledTimes(1);
  });

  it("should execute correctly if type is DELETED and objType is 'system'", async () => {
    const data = createEvent({
      itemType: "SYSTEMS",
      type: "DELETED",
      items: [
        { code: "BS1", objType: ObjType.System },
        { code: "BS2", objType: ObjType.System }
      ]
    });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(2);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete variant if objType is 'variant'", async () => {
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
            variantOptions: [
              { code: "Test_Variant_1" },
              { code: "Test_Variant_3" },
              { code: "Test_Variant_4" }
            ]
          })
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete system layer if objType is 'layer'", async () => {
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
            systemLayers: [
              { code: "Test_Layer_1" },
              { code: "Test_Layer_3" },
              { code: "Test_Layer_4" }
            ]
          })
        }
      ]
    });

    await handleMessage(data, {});

    expect(set).toBeCalledTimes(1);
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

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
    expect(commit).toBeCalledTimes(1);
  });

  it("should delete system if only one layer is present", async () => {
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
            systemLayers: [{ code: "Test_Layer_1" }]
          })
        }
      ]
    });

    await handleMessage(data, {});

    expect(deleteFunc).toBeCalledTimes(1);
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
