import { RequestParams } from "@elastic/elasticsearch";
import { ResponseError } from "@elastic/elasticsearch/lib/errors";
import {
  createElasticSearchIndex,
  createIndexAlias,
  ElasticsearchIndexes
} from "../elasticsearch";

const getEsClient = jest.fn();
const esCreate = jest.fn();
const esDelete = jest.fn();
const esPutAlias = jest.fn();
const esDeleteAlias = jest.fn();
const esBulkMethodMock = jest.fn();
const catAliases = jest.fn();
jest.mock("@bmi/functions-es-client", () => {
  return { getEsClient: (...args: any[]) => getEsClient(...args) };
});
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

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  getEsClient.mockImplementation(() => ({
    cat: {
      aliases: (params: RequestParams.CatAliases) => catAliases(params)
    },
    indices: {
      create: (...args: any) => esCreate(...args),
      delete: (...args: any) => esDelete(...args),
      putAlias: (...args: any) => esPutAlias(...args),
      deleteAlias: (...args: any) => esDeleteAlias(...args)
    },
    bulk: (...args: any) => esBulkMethodMock(...args)
  }));
});

const productsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
const systemsIndex = `${process.env.ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
const documentsIndex = `${process.env.ES_INDEX_NAME_DOCUMENTS}`;

describe("createElasticSearchIndex", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await createElasticSearchIndex(ElasticsearchIndexes.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).not.toHaveBeenCalled();
  });

  it("should error if creating index throws error", async () => {
    esCreate.mockRejectedValue(
      new ResponseError({
        body: {
          error: {
            root_cause: [
              {
                type: "security_exception",
                reason:
                  "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
              }
            ],
            type: "security_exception",
            reason:
              "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
          },
          status: 403
        },
        statusCode: 403,
        headers: {},
        meta: {} as any,
        warnings: null
      })
    );

    try {
      await createElasticSearchIndex(productsIndex);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "security_exception: [security_exception] Reason: action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: productsIndex });
  });

  it("should return if creating products index", async () => {
    await createElasticSearchIndex(productsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: productsIndex });
  });

  it("should return if creating systems index", async () => {
    await createElasticSearchIndex(systemsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: systemsIndex });
  });

  it("should return if creating documents index", async () => {
    await createElasticSearchIndex(documentsIndex);

    expect(getEsClient).toHaveBeenCalled();
    expect(esCreate).toHaveBeenCalledWith({ index: documentsIndex });
  });
});

describe("createIndexAlias", () => {
  it("should error if getEsClient throws error", async () => {
    getEsClient.mockRejectedValue(Error("Expected error"));

    try {
      await createIndexAlias("index_1", "index_alias");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esPutAlias).not.toHaveBeenCalled();
  });

  it("should error if delete alias throws error", async () => {
    const indexName = "index_1";
    const aliasName = "index_alias";
    const indexWithReadAlias = "index_with_read_alias";
    esPutAlias.mockResolvedValueOnce({ statusCode: 200 });
    catAliases.mockReturnValueOnce({
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
    });
    esDeleteAlias.mockRejectedValue(
      new ResponseError({
        body: {
          error: {
            root_cause: [
              {
                type: "security_exception",
                reason:
                  "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
              }
            ],
            type: "security_exception",
            reason:
              "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
          },
          status: 403
        },
        statusCode: 403,
        headers: {},
        meta: {} as any,
        warnings: null
      })
    );

    try {
      await createIndexAlias(indexName, aliasName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "security_exception: [security_exception] Reason: action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esDeleteAlias).toHaveBeenCalledWith({
      index: indexWithReadAlias,
      name: aliasName
    });
  });

  it("should error if delete alias status is not 200", async () => {
    const indexName = "index_1";
    const aliasName = "index_alias";
    const indexWithReadAlias = "index_with_read_alias";
    esPutAlias.mockResolvedValueOnce({ statusCode: 200 });
    catAliases.mockReturnValueOnce({
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
    });
    esDeleteAlias.mockResolvedValueOnce({ statusCode: 201, body: {} });

    await createIndexAlias(indexName, aliasName);

    expect(getEsClient).toHaveBeenCalled();
    expect(esDeleteAlias).toHaveBeenCalledWith({
      index: indexWithReadAlias,
      name: aliasName
    });
    expect(loggerWarning).toHaveBeenCalledWith({
      message: `Could not delete alias '${aliasName}' on from index ${indexWithReadAlias}, Error: {}`
    });
  });

  it("should error if creating index alias throws error", async () => {
    const indexName = "index_1";
    const aliasName = "index_alias";

    esPutAlias.mockRejectedValue(
      new ResponseError({
        body: {
          error: {
            root_cause: [
              {
                type: "security_exception",
                reason:
                  "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
              }
            ],
            type: "security_exception",
            reason:
              "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
          },
          status: 403
        },
        statusCode: 403,
        headers: {},
        meta: {} as any,
        warnings: null
      })
    );

    try {
      await createIndexAlias(indexName, aliasName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "security_exception: [security_exception] Reason: action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
      );
    }

    expect(getEsClient).toHaveBeenCalled();
    expect(esPutAlias).toHaveBeenCalledWith({
      index: indexName,
      name: aliasName
    });
  });

  describe("when cat alias throws error", () => {
    it("should continue to create alias", async () => {
      const indexName = "index_1";
      const aliasName = "index_alias";
      catAliases.mockRejectedValue(
        new ResponseError({
          body: {
            error: {
              root_cause: [
                {
                  type: "security_exception",
                  reason:
                    "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
                }
              ],
              type: "security_exception",
              reason:
                "action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
            },
            status: 403
          },
          statusCode: 403,
          headers: {},
          meta: {} as any,
          warnings: null
        })
      );

      esPutAlias.mockResolvedValueOnce({ statusCode: 200 });

      await createIndexAlias(indexName, aliasName);

      expect(getEsClient).toHaveBeenCalled();

      await expect(catAliases).rejects.toThrow(
        "security_exception: [security_exception] Reason: action [indices:data/write/create] is unauthorized for API key id [SOMETHING] of user [USER] on indices [INDEX], this action is granted by the index privileges [read,all]"
      );
      //cat aliases returns emtpy list of index array
      expect(esDeleteAlias).not.toHaveBeenCalled();
      // simply add alias to new index
      expect(esPutAlias).toHaveBeenCalledWith({
        index: indexName,
        name: aliasName
      });

      expect(loggerInfo).toHaveBeenLastCalledWith({
        message: `Success creating alias '${aliasName}' on write index '${indexName}'`
      });
    });
  });

  describe("when alias is created successfully", () => {
    it("should log success message", async () => {
      const indexName = "index_1";
      const aliasName = "index_alias";
      const indexWithReadAlias = "index_with_read_alias";
      catAliases.mockReturnValueOnce({
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
      });
      esDeleteAlias.mockResolvedValueOnce({ statusCode: 200 });
      esPutAlias.mockResolvedValueOnce({ statusCode: 200 });

      await createIndexAlias(indexName, aliasName);

      expect(getEsClient).toHaveBeenCalled();
      expect(catAliases).toHaveBeenCalled();
      expect(esDeleteAlias).toHaveBeenCalledWith({
        index: indexWithReadAlias,
        name: aliasName
      });
      expect(esPutAlias).toHaveBeenCalledWith({
        index: indexName,
        name: aliasName
      });

      expect(loggerInfo).toHaveBeenLastCalledWith({
        message: `Success creating alias '${aliasName}' on write index '${indexName}'`
      });
    });
  });
});
