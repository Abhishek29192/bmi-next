import { ObjType } from "@bmi/pub-sub-types";
import mockConsole from "jest-mock-console";
import { deleteESItemByCode } from "../deleteESItemByCode";

const getEsClient = jest.fn();
const deleteByQuery = jest.fn();

jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: []) => getEsClient(...args) };
});

beforeAll(() => {
  process.env.ES_INDEX_PREFIX = "dxb_no";
  process.env.ES_INDEX_NAME_DOCUMENTS = "pim-documents-test";
  mockConsole();
});

interface Params {
  index: string;
  body: {
    query: {
      match: Record<"code" | "baseProduct.code" | "productBaseCode", string>;
    };
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();

  getEsClient.mockImplementation(() => ({
    deleteByQuery: (params: Params) => deleteByQuery(params)
  }));
});

describe("deleteESItemByCode", () => {
  it("should perform delete operation for base product and related documents on delete message", async () => {
    const deleteItem = {
      code: "test_code_base_product",
      objType: ObjType.Base_product
    };

    await deleteESItemByCode(deleteItem, "PRODUCTS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_products",
      body: {
        query: {
          match: {
            "baseProduct.code": deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toBeCalledWith({
      index: "pim-documents-test",
      body: {
        query: {
          match: {
            productBaseCode: deleteItem.code
          }
        }
      }
    });
  });

  it("should perform delete operation for variant and NOT perform delete operation for documnets on delete message ", async () => {
    const deleteItem = {
      code: "test_code_variant",
      objType: ObjType.Variant
    };

    await deleteESItemByCode(deleteItem, "PRODUCTS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_products",
      body: {
        query: {
          match: {
            code: deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toBeCalledTimes(1);
  });

  it("should perform delete operation for systems and related documents on delete message ", async () => {
    const deleteItem = {
      code: "test_code_system",
      objType: ObjType.System
    };

    await deleteESItemByCode(deleteItem, "SYSTEMS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_systems",
      body: {
        query: {
          match: {
            code: deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toBeCalledWith({
      index: "pim-documents-test",
      body: {
        query: {
          match: {
            productBaseCode: deleteItem.code
          }
        }
      }
    });
  });

  it("should log message and do nothing and NOT perform delete operation for documnets if layer code provided on delete message ", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const deleteItem = {
      code: "test_code_layer",
      objType: ObjType.Layer
    };

    await deleteESItemByCode(deleteItem, "SYSTEMS");

    const logData = consoleSpy.mock.calls;

    const logMessage = JSON.parse(logData[logData.length - 1][0]).message;

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledTimes(0);
    expect(logMessage).toEqual(
      "ES Systems documents do not contain field 'Layer'"
    );
  });
});
