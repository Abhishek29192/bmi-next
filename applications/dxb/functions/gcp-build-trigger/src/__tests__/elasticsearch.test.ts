import { RequestParams } from "@elastic/elasticsearch";
import { swapReadWriteAliases } from "../elasticsearch";

const loggerError = jest.fn();
const loggerInfo = jest.fn();
const loggerDebug = jest.fn();
const loggerWarning = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message),
  debug: (message: any) => loggerDebug(message),
  warning: (message: any) => loggerWarning(message)
}));

const getEsClient = jest.fn();
const esPutAlias = jest.fn();
const esDeleteAlias = jest.fn();
const esDelete = jest.fn();
const catAliases = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: (...params: any) => getEsClient(...params)
}));

const mockClient = {
  cat: {
    aliases: (params: RequestParams.CatAliases) => catAliases(params)
  },
  indices: {
    putAlias: (params: RequestParams.IndicesPutAlias) => esPutAlias(params),
    deleteAlias: (params: RequestParams.IndicesDeleteAlias) =>
      esDeleteAlias(params),
    delete: (params: RequestParams.IndicesDelete) => esDelete(params)
  }
};
getEsClient.mockResolvedValue(mockClient);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
describe("swapReadWriteAliases", () => {
  it("should do nothing if alias is not provided", async () => {
    await swapReadWriteAliases("");

    expect(getEsClient).not.toBeCalled();
    expect(catAliases).not.toBeCalled();
    expect(esPutAlias).not.toBeCalled();
    expect(esDeleteAlias).not.toBeCalled();
    expect(esDelete).not.toBeCalled();
  });

  it("should throw error when getEsClient throws error", async () => {
    getEsClient.mockRejectedValueOnce(Error("Expected error"));

    try {
      await swapReadWriteAliases("index_name_prefix");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toBeCalled();
    expect(catAliases).not.toBeCalled();
    expect(esPutAlias).not.toBeCalled();
    expect(esDeleteAlias).not.toBeCalled();
    expect(esDelete).not.toBeCalled();
  });

  describe("when cat aliases throws error", () => {
    it("should log error and do nothing", async () => {
      catAliases.mockRejectedValue(Error("findIndexNamesForAlias error"));
      await swapReadWriteAliases("index_name_prefix");

      expect(getEsClient).toHaveBeenCalledTimes(3);
      expect(catAliases).toHaveBeenCalledTimes(2);
      await expect(catAliases).rejects.toThrow("findIndexNamesForAlias error");
      expect(esPutAlias).not.toBeCalled();
      expect(esDeleteAlias).not.toBeCalled();
      expect(esDelete).not.toBeCalled();
      expect(loggerError).toHaveBeenCalledTimes(2);
    });
  });

  describe("when put aliases throws error", () => {
    it("should log error and do nothing", async () => {
      esDeleteAlias.mockResolvedValueOnce({ statusCode: 200 });
      esPutAlias.mockRejectedValueOnce(new Error("Put aliases error"));

      const aliasPrefix = "some_alias_prefix";
      const indexWithWriteAlias = "index_with_write_alias";
      const indexWithReadAlias = "index_with_read_alias";
      catAliases
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithReadAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        })
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithWriteAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        });

      try {
        await swapReadWriteAliases(aliasPrefix);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toEqual("Put aliases error");
      }

      expect(getEsClient).toHaveBeenCalledTimes(3);
      expect(catAliases).toHaveBeenCalledTimes(2);
      expect(loggerError).toBeCalledWith({ message: "Put aliases error" });
      expect(esDeleteAlias).toBeCalledWith({
        index: indexWithReadAlias,
        name: `${aliasPrefix}_read`
      });
      expect(esDelete).not.toBeCalled();
      //verify that last success message was never logged!
      expect(loggerInfo).not.lastCalledWith();
    });
  });

  describe("when delete aliases throws error", () => {
    it("should log error and do nothing", async () => {
      esDeleteAlias.mockRejectedValue(Error("Delete alias error"));
      esPutAlias.mockResolvedValue({ statusCode: 200 });
      esDelete.mockResolvedValue({ statusCode: 200 });

      const aliasPrefix = "some_alias_prefix";
      const indexWithWriteAlias = "index_with_write_alias";
      const indexWithReadAlias = "index_with_read_alias";
      catAliases
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithReadAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        })
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithWriteAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        });

      try {
        await swapReadWriteAliases(aliasPrefix);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toEqual("Delete alias error");
      }

      expect(getEsClient).toHaveBeenCalledTimes(3);
      expect(catAliases).toHaveBeenCalledTimes(2);
      expect(esDeleteAlias).toHaveBeenCalledTimes(1);
      await expect(esDeleteAlias).rejects.toThrow("Delete alias error");
      expect(esPutAlias).toHaveBeenCalledTimes(0);
      expect(loggerError).toBeCalledWith({ message: "Delete alias error" });

      expect(esDelete).not.toBeCalled();
      //verify that last success message was never logged!
      expect(loggerInfo).not.lastCalledWith({
        message: `Success swapping alias ${aliasPrefix}`
      });
    });
  });

  describe("when delete indices throws error", () => {
    it("should log error and do nothing", async () => {
      esPutAlias.mockResolvedValue({ statusCode: 200 });
      esDelete.mockRejectedValueOnce(new Error("Delete index error"));
      esDeleteAlias.mockResolvedValue({ statusCode: 200 });

      const aliasPrefix = "some_alias_prefix";
      const indexWithWriteAlias = "index_with_write_alias";
      const indexWithReadAlias = "index_with_read_alias";
      catAliases
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithReadAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        })
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithWriteAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        });

      try {
        await swapReadWriteAliases(aliasPrefix);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toEqual("Delete index error");
      }

      expect(getEsClient).toHaveBeenCalledTimes(3);
      expect(catAliases).toHaveBeenCalledTimes(2);
      expect(esPutAlias).toHaveBeenCalledTimes(1);
      expect(loggerError).toBeCalledWith({ message: "Delete index error" });
      expect(esDeleteAlias).toHaveBeenCalledTimes(1);
      expect(esDelete).toHaveBeenCalledTimes(1);
      //verify that last success message was never logged!
      expect(loggerInfo).not.lastCalledWith({
        message: `Success swapping alias ${aliasPrefix}`
      });
    });
  });

  describe("when no indexes are pointing to given alias", () => {
    it("should do nothing", async () => {
      catAliases.mockReturnValue([]);
      await swapReadWriteAliases("index_name_prefix");

      expect(getEsClient).toHaveBeenCalledTimes(3);
      expect(catAliases).toHaveBeenCalledTimes(2);
      expect(esPutAlias).not.toBeCalled();
      expect(esDeleteAlias).not.toBeCalled();
      expect(esDelete).not.toBeCalled();
    });
  });

  describe("when write alias is pointing more than one index", () => {
    it("should log error and do nothing", async () => {
      const aliasPrefix = "some_alias_prefix";
      const indexWithWriteAlias = "index_with_write_alias";
      const indexWithWriteAlias2 = "index_with_write_alias_2";
      const indexWithReadAlias = "index_with_read_alias";
      catAliases
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithReadAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        })
        .mockReturnValueOnce({
          statusCode: 200,
          body: {
            severity: "INFO",
            0: {
              alias: "",
              index: indexWithWriteAlias,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            },
            1: {
              alias: "",
              index: indexWithWriteAlias2,
              filter: "",
              "routing-index": "",
              "routing.search": "",
              is_write_index: ""
            }
          }
        });

      try {
        await swapReadWriteAliases(aliasPrefix);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toEqual(
          `Multiple indexes '["${indexWithWriteAlias}","${indexWithWriteAlias2}"]' pointing to '${aliasPrefix}_write'. Restart Full fetch`
        );
      }
      expect(getEsClient).toHaveBeenCalledTimes(2);
      expect(catAliases).toHaveBeenCalledTimes(2);
      expect(esPutAlias).not.toBeCalled();
      expect(esDeleteAlias).not.toBeCalled();
      expect(esDelete).not.toBeCalled();
    });
  });

  describe("when write alias is pointing single index", () => {
    describe("when read alias is pointing to single index", () => {
      it("should assign read alias to index pointing to write alias", async () => {
        const aliasPrefix = "some_alias_prefix";
        const indexWithWriteAlias = "index_with_write_alias";
        const indexWithReadAlias = "index_with_read_alias";
        esDeleteAlias.mockResolvedValueOnce({ statusCode: 200 });
        esPutAlias.mockResolvedValueOnce({ statusCode: 200 });
        esDelete.mockReturnValueOnce({ statusCode: 200 });
        catAliases
          .mockReturnValueOnce({
            statusCode: 200,
            body: {
              severity: "INFO",
              0: {
                alias: "",
                index: indexWithReadAlias,
                filter: "",
                "routing-index": "",
                "routing.search": "",
                is_write_index: ""
              }
            }
          })
          .mockReturnValueOnce({
            statusCode: 200,
            body: {
              severity: "INFO",
              0: {
                alias: "",
                index: indexWithWriteAlias,
                filter: "",
                "routing-index": "",
                "routing.search": "",
                is_write_index: ""
              }
            }
          });

        await swapReadWriteAliases(aliasPrefix);

        expect(getEsClient).toHaveBeenCalledTimes(3);
        expect(catAliases).toHaveBeenCalledTimes(2);
        expect(esPutAlias).toHaveBeenCalledWith({
          index: indexWithWriteAlias,
          name: `${aliasPrefix}_read`
        });
        expect(esDeleteAlias).toHaveBeenCalledWith({
          index: indexWithReadAlias,
          name: `${aliasPrefix}_read`
        });
        expect(esDelete).toHaveBeenCalledWith({
          index: indexWithReadAlias
        });
        expect(loggerInfo).toHaveBeenLastCalledWith({
          message: `Success swapping alias '${aliasPrefix}'`
        });
      });
    });
    describe("when read alias is pointing to multiple index", () => {
      it("should assign read alias to index pointing to write alias", async () => {
        const aliasPrefix = "some_alias_prefix";
        const indexWithWriteAlias = "index_with_write_alias";
        const indexWithReadAlias = "index_with_read_alias";
        const indexWithReadAlias2 = "index_with_read_alias_2";
        esDeleteAlias.mockResolvedValue({ statusCode: 200 });
        esPutAlias.mockResolvedValue({ statusCode: 200 });
        esDelete.mockReturnValue({ statusCode: 200 });
        catAliases
          .mockReturnValueOnce({
            statusCode: 200,
            body: {
              severity: "INFO",
              0: {
                alias: "",
                index: indexWithReadAlias,
                filter: "",
                "routing-index": "",
                "routing.search": "",
                is_write_index: ""
              },
              1: {
                alias: "",
                index: indexWithReadAlias2,
                filter: "",
                "routing-index": "",
                "routing.search": "",
                is_write_index: ""
              }
            }
          })
          .mockReturnValueOnce({
            statusCode: 200,
            body: {
              severity: "INFO",
              0: {
                alias: "",
                index: indexWithWriteAlias,
                filter: "",
                "routing-index": "",
                "routing.search": "",
                is_write_index: ""
              }
            }
          });

        await swapReadWriteAliases(aliasPrefix);

        expect(getEsClient).toHaveBeenCalledTimes(3);
        expect(catAliases).toHaveBeenCalledTimes(2);

        expect(esDeleteAlias).toHaveBeenCalledTimes(2);
        expect(esDeleteAlias).toHaveBeenNthCalledWith(1, {
          index: indexWithReadAlias,
          name: `${aliasPrefix}_read`
        });
        expect(esDeleteAlias).toHaveBeenNthCalledWith(2, {
          index: indexWithReadAlias2,
          name: `${aliasPrefix}_read`
        });

        expect(esPutAlias).toHaveBeenCalledTimes(1);
        expect(esPutAlias).toHaveBeenCalledWith({
          index: indexWithWriteAlias,
          name: `${aliasPrefix}_read`
        });

        expect(esDelete).toHaveBeenCalledTimes(2);
        expect(esDelete).toHaveBeenNthCalledWith(1, {
          index: indexWithReadAlias
        });
        expect(esDelete).toHaveBeenNthCalledWith(2, {
          index: indexWithReadAlias2
        });
        expect(loggerInfo).toHaveBeenLastCalledWith({
          message: `Success swapping alias '${aliasPrefix}'`
        });
      });
    });
  });
});
