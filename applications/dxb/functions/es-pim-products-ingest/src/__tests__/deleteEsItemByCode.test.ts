import { ObjType } from "@bmi/pub-sub-types";
import { ApiResponse } from "@elastic/elasticsearch";
import { ResponseError } from "@elastic/elasticsearch/lib/errors";
import { deleteEsItemByCode, ItemTypes } from "../deleteEsItemByCode";

const getEsClient = jest.fn();
const deleteByQuery = jest.fn();

jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: []) => getEsClient(...args) };
});

beforeAll(() => {
  process.env.ES_INDEX_PREFIX = "dxb_no";
  process.env.ES_INDEX_NAME_DOCUMENTS = "pim-documents-test";
});

interface Params {
  index: string;
  body: {
    query: {
      match: Record<"code" | "baseProduct.code" | "productBaseCode", string>;
    };
  };
}

type TestCase = {
  objType: ObjType;
  callTimes: number;
  itemType: ItemTypes;
};

const testCases: TestCase[] = [
  {
    objType: ObjType.System,
    itemType: "SYSTEMS",
    callTimes: 2
  },
  {
    objType: ObjType.Base_product,
    itemType: "PRODUCTS",
    callTimes: 2
  },
  {
    objType: ObjType.Variant,
    itemType: "PRODUCTS",
    callTimes: 1
  }
];

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

    await deleteEsItemByCode(deleteItem, "PRODUCTS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_products_write",
      body: {
        query: {
          match: {
            "baseProduct.code": deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toBeCalledWith({
      index: "pim-documents-test_write",
      body: {
        query: {
          match: {
            productBaseCode: deleteItem.code
          }
        }
      }
    });
  });

  it("should perform delete operation for variant and NOT perform delete operation for documents on delete message ", async () => {
    const deleteItem = {
      code: "test_code_variant",
      objType: ObjType.Variant
    };

    await deleteEsItemByCode(deleteItem, "PRODUCTS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_products_write",
      body: {
        query: {
          match: {
            code: deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toHaveBeenCalledTimes(1);
  });

  it("should perform delete operation for systems and related documents on delete message ", async () => {
    const deleteItem = {
      code: "test_code_system",
      objType: ObjType.System
    };

    await deleteEsItemByCode(deleteItem, "SYSTEMS");

    expect(getEsClient).toBeCalled();
    expect(deleteByQuery).toBeCalledWith({
      index: "dxb_no_systems_write",
      body: {
        query: {
          match: {
            code: deleteItem.code
          }
        }
      }
    });
    expect(deleteByQuery).toBeCalledWith({
      index: "pim-documents-test_write",
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

    await deleteEsItemByCode(deleteItem, "SYSTEMS");

    const logData = consoleSpy.mock.calls;

    const logMessage = JSON.parse(logData[logData.length - 1][0]).message;

    expect(getEsClient).not.toBeCalled();
    expect(deleteByQuery).toHaveBeenCalledTimes(0);
    expect(logMessage).toEqual("'Layer' is not indexed into ES");
  });

  describe("esDeleteByQuery", () => {
    testCases.forEach(({ objType, itemType, callTimes }: TestCase) => {
      const deleteItem = { code: "test-code", objType };

      it(`should perform a delete operation for ${objType} if a ResponseError occurs and not propagate the error`, async () => {
        deleteByQuery
          .mockRejectedValueOnce(
            new ResponseError({ statusCode: 400 } as ApiResponse)
          )
          .mockResolvedValueOnce(undefined);

        try {
          await deleteEsItemByCode(deleteItem, itemType);
        } catch (error) {
          expect(true).toEqual(`An error should not be thrown: ${error}`);
        }

        expect(getEsClient).toBeCalled();
        expect(deleteByQuery).toHaveBeenCalledTimes(callTimes);
      });

      it(`should perform a delete operation for documents if an unknown error occurs when deleting the ${objType} and not propagate the error`, async () => {
        deleteByQuery
          .mockRejectedValueOnce(new Error("Expected error"))
          .mockResolvedValueOnce(undefined);

        try {
          await deleteEsItemByCode(deleteItem, itemType);
        } catch (error) {
          expect(true).toEqual(`An error should not be thrown: ${error}`);
        }

        expect(getEsClient).toBeCalled();
        expect(deleteByQuery).toHaveBeenCalledTimes(callTimes);
      });

      it(`should not propagate the error when deleting the ${objType} product documents`, async () => {
        deleteByQuery
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error("Expected error"));

        try {
          await deleteEsItemByCode(deleteItem, itemType);
        } catch (error) {
          expect(true).toEqual(`An error should not be thrown: ${error}`);
        }

        expect(getEsClient).toBeCalled();
        expect(deleteByQuery).toHaveBeenCalledTimes(callTimes);
      });
    });
  });
});
