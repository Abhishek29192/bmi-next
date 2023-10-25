import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import { createTraining } from "@bmi/elasticsearch-types";
import { getESQuery, useTrainings } from "../useTrainings";
import { Config, ConfigProvider } from "../../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../../utils/elasticSearch";
import { SHOW_MORE_LIMIT } from "../../constants";
import { EsResponse, EsCollapsedTraining, EsTrainingHit } from "../../types";

const esIndexNameTrainings = "dxb-all-trainings_read";

const training1 = createTraining({
  id: "1-1",
  catalogueId: 1,
  courseId: 1
});
const training2 = createTraining({
  id: "2-1",
  code: "uk-catalog",
  name: "uk-catalog",
  catalogueId: 1,
  courseId: 2
});
const training3 = createTraining({
  id: "3-2",
  code: "no-catalog",
  name: "no-catalog",
  catalogueId: 2,
  courseId: 3
});
const training4 = createTraining({
  id: "4-1",
  code: "IT-catalog",
  name: "IT-catalog",
  catalogueId: 1,
  courseId: 4
});
const training5 = createTraining({
  id: "5-1",
  code: "uk-catalog",
  name: "uk-catalog",
  catalogueId: 1,
  courseId: 5
});

const collapsedTrainingsResponse: EsResponse<EsCollapsedTraining> = {
  hits: {
    total: { value: 3, relation: "eq" },
    max_score: null,
    hits: [
      {
        inner_hits: {
          inner_hits: {
            hits: {
              total: { value: 2, relation: "eq" },
              max_score: 0,
              hits: [
                {
                  _index: esIndexNameTrainings,
                  _type: "_doc",
                  _id: training1.id,
                  _score: 0,
                  _source: training1
                },
                {
                  _index: esIndexNameTrainings,
                  _type: "_doc",
                  _id: training2.id,
                  _score: 0,
                  _source: training2
                }
              ]
            }
          }
        },
        _source: training1
      },
      {
        inner_hits: {
          inner_hits: {
            hits: {
              total: { value: 1, relation: "eq" },
              max_score: 0,
              hits: [
                {
                  _index: esIndexNameTrainings,
                  _type: "_doc",
                  _id: training3.id,
                  _score: 0,
                  _source: training3
                }
              ]
            }
          }
        },
        _source: training3
      }
    ]
  }
};

const paginatedEsResponse: EsResponse<EsTrainingHit> = {
  hits: {
    total: {
      value: 2,
      relation: "eq"
    },
    max_score: null,
    hits: [
      {
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: training4.id,
        _score: 0,
        _source: training4
      },
      {
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: training5.id,
        _score: 0,
        _source: training5
      }
    ]
  }
};

const collapsedTrainingsSearchResponse: EsResponse<EsCollapsedTraining> = {
  hits: {
    total: { value: 1, relation: "eq" },
    max_score: null,
    hits: [
      {
        inner_hits: {
          inner_hits: {
            hits: {
              total: { value: 1, relation: "eq" },
              max_score: 0,
              hits: [
                {
                  _index: esIndexNameTrainings,
                  _type: "_doc",
                  _id: training2.id,
                  _score: 0,
                  _source: training2
                }
              ]
            }
          }
        },
        _source: training2
      }
    ]
  }
};

const collapsedTrainingsMultipleSearchResponse: EsResponse<EsCollapsedTraining> =
  {
    hits: {
      total: { value: 2, relation: "eq" },
      max_score: null,
      hits: [
        {
          inner_hits: {
            inner_hits: {
              hits: {
                total: { value: 2, relation: "eq" },
                max_score: 0,
                hits: [
                  {
                    _index: esIndexNameTrainings,
                    _type: "_doc",
                    _id: training2.id,
                    _score: 0,
                    _source: training2
                  },
                  {
                    _index: esIndexNameTrainings,
                    _type: "_doc",
                    _id: training5.id,
                    _score: 0,
                    _source: training5
                  }
                ]
              }
            }
          },
          _source: training2
        }
      ]
    }
  };

const paginatedSearchEsResponse: EsResponse<EsTrainingHit> = {
  hits: {
    total: {
      value: 2,
      relation: "eq"
    },
    max_score: null,
    hits: [
      {
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: training2.id,
        _score: 0,
        _source: training2
      },
      {
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: training2.id,
        _score: 0,
        _source: training2
      }
    ]
  }
};

const queryElasticsearchMock = jest.fn();

jest.mock("../../../../utils/elasticSearch", () => ({
  queryElasticSearch: (...args: Parameters<typeof queryElasticSearch>) =>
    queryElasticsearchMock(...args)
}));

const render = ({
  configOverride = { esIndexNameTrainings }
}: {
  configOverride?: Partial<Config>;
} = {}) => {
  const Wrapper = ({ children }: { children: JSX.Element }) => (
    <ConfigProvider configOverride={configOverride}>{children}</ConfigProvider>
  );

  return renderHook(useTrainings, { wrapper: Wrapper });
};

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  mockConsole();
});

describe("useTrainings", () => {
  describe("on page mount", () => {
    it("pulls trainings on page mount", async () => {
      queryElasticsearchMock.mockResolvedValue(collapsedTrainingsResponse);
      const { result } = render();
      expect(queryElasticsearchMock).toHaveBeenCalledTimes(1);
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );

      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      expect(result.current.groupedTrainings).toEqual({
        1: [training1, training2],
        2: [training3]
      });
      expect(result.current.total).toEqual({ 1: 2, 2: 1 });
    });

    it("works correctly if 'queryElasticSearch' throws an error", async () => {
      const error = new Error("Expected error");
      queryElasticsearchMock.mockRejectedValue(error);
      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );
      expect(result.current.groupedTrainings).toEqual({});
      expect(result.current.total).toEqual({});
      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should not call 'queryElasticsearchMock' if 'esIndexNameTrainings' does not exist", async () => {
      const { result } = render({
        configOverride: { esIndexNameTrainings: undefined }
      });
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      expect(queryElasticsearchMock).not.toHaveBeenCalled();
      expect(result.current.groupedTrainings).toEqual({});
      expect(result.current.total).toEqual({});
    });
  });

  describe("fetchPaginatedTrainings", () => {
    it("should not call 'queryElasticsearchMock' if 'esIndexNameTrainings' does not exist", async () => {
      const { result } = render({
        configOverride: { esIndexNameTrainings: undefined }
      });
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).not.toHaveBeenCalled();

      result.current.fetchPaginatedTrainings(1, 1);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).not.toHaveBeenCalled();
      expect(result.current.groupedTrainings).toEqual({});
      expect(result.current.total).toEqual({});
    });

    it("groups trainings correctly if 'fetchPaginatedTrainings' pulls trainings", async () => {
      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsResponse)
        .mockResolvedValueOnce(paginatedEsResponse);
      const catalogueId = 1;
      const from = 1;

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );

      result.current.fetchPaginatedTrainings(catalogueId, from);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          from,
          size: SHOW_MORE_LIMIT,
          query: {
            match: {
              catalogueId
            }
          }
        },
        esIndexNameTrainings
      );

      await waitFor(() =>
        expect(result.current.groupedTrainings).toEqual({
          1: [training1, training2, training4, training5],
          2: [training3]
        })
      );
    });

    it("works correctly if 'queryElasticsearch' throws an error", async () => {
      const error = new Error("Expected error");
      const catalogueId = 1;
      const from = 1;

      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsResponse)
        .mockRejectedValueOnce(error);

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );

      result.current.fetchPaginatedTrainings(catalogueId, from);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          from,
          size: SHOW_MORE_LIMIT,
          query: {
            match: {
              catalogueId
            }
          }
        },
        esIndexNameTrainings
      );
      await waitFor(() => expect(console.error).toHaveBeenCalledWith(error));
      expect(result.current.groupedTrainings).toEqual({
        1: [training1, training2],
        2: [training3]
      });
    });
  });

  describe("collapseCatalogueCourses", () => {
    it("returns only first 6 trainings", async () => {
      const firstCatalogueTrainings = new Array(10);
      firstCatalogueTrainings.fill({
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: training1.id,
        _score: 0,
        _source: training1
      });

      const collapsedTrainingsResponse: EsResponse<EsCollapsedTraining> = {
        hits: {
          total: { value: 11, relation: "eq" },
          max_score: null,
          hits: [
            {
              inner_hits: {
                inner_hits: {
                  hits: {
                    total: { value: 10, relation: "eq" },
                    max_score: 0,
                    hits: firstCatalogueTrainings
                  }
                }
              },
              _source: training1
            },
            {
              inner_hits: {
                inner_hits: {
                  hits: {
                    total: { value: 1, relation: "eq" },
                    max_score: 0,
                    hits: [
                      {
                        _index: esIndexNameTrainings,
                        _type: "_doc",
                        _id: training3.id,
                        _score: 0,
                        _source: training3
                      }
                    ]
                  }
                }
              },
              _source: training3
            }
          ]
        }
      };
      queryElasticsearchMock.mockResolvedValue(collapsedTrainingsResponse);

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));

      expect(result.current.groupedTrainings).toEqual({
        1: new Array(10).fill(training1),
        2: [training3]
      });

      result.current.collapseCatalogueCourses(training1.catalogueId);
      expect(result.current.groupedTrainings).toEqual({
        1: new Array(6).fill(training1),
        2: [training3]
      });
    });
  });

  describe("return ES query", () => {
    const searchQuery = "it";
    const noSearchQuery = null;
    const from = 6;
    const catalogueId = 2;
    const isFromMount = "initialMount";
    const isFromPagination = "pagination";
    it("return ES query on mount without search", async () => {
      const result = getESQuery(noSearchQuery, isFromMount, catalogueId, from);
      expect(result).toStrictEqual({
        collapse: {
          field: "catalogueId",
          inner_hits: {
            name: "inner_hits",
            size: SHOW_MORE_LIMIT
          }
        }
      });
    });

    it("return ES query on mount with search", async () => {
      const result = getESQuery(searchQuery, isFromMount, catalogueId, from);
      expect(result).toStrictEqual({
        query: {
          query_string: {
            query: `*${searchQuery}*`,
            fields: ["code", "name"]
          }
        },
        collapse: {
          field: "catalogueId",
          inner_hits: {
            name: "inner_hits",
            size: SHOW_MORE_LIMIT
          }
        }
      });
    });

    it("return ES query on pagination without search", async () => {
      const result = getESQuery(
        noSearchQuery,
        isFromPagination,
        catalogueId,
        from
      );
      expect(result).toStrictEqual({
        from,
        size: SHOW_MORE_LIMIT,
        query: {
          match: {
            catalogueId: catalogueId
          }
        }
      });
    });

    it("return ES query on pagination with search", async () => {
      const result = getESQuery(
        searchQuery,
        isFromPagination,
        catalogueId,
        from
      );
      expect(result).toStrictEqual({
        from,
        size: SHOW_MORE_LIMIT,
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: `*${searchQuery}*`,
                  fields: ["code", "name"]
                }
              },
              {
                match: {
                  catalogueId: catalogueId
                }
              }
            ]
          }
        }
      });
    });
  });

  describe("training list search", () => {
    it("should return searched training results for query_string as *in* on page mount", async () => {
      Object.defineProperty(window, "location", {
        value: {
          search: "?q=uk"
        }
      });

      queryElasticsearchMock.mockResolvedValue(
        collapsedTrainingsSearchResponse
      );

      const { result } = render();
      await waitFor(() =>
        expect(queryElasticsearchMock).toHaveBeenCalledWith(
          {
            query: {
              query_string: {
                query: `*uk*`,
                fields: ["code", "name"]
              }
            },
            collapse: {
              field: "catalogueId",
              inner_hits: {
                name: "inner_hits",
                size: SHOW_MORE_LIMIT
              }
            }
          },
          esIndexNameTrainings
        )
      );
      await waitFor(() => expect(result.current.initialLoading).toBe(false));

      expect(result.current.groupedTrainings).toEqual({
        1: [training2]
      });

      expect(result.current.total).toEqual({ 1: 1 });
    });
  });

  describe("training list search - fetch pagination", () => {
    it("groups trainings correctly if 'fetchPaginatedTrainings' pulls trainings", async () => {
      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsMultipleSearchResponse)
        .mockResolvedValueOnce(paginatedSearchEsResponse);
      Object.defineProperty(window, "location", {
        value: {
          search: "?q=uk"
        }
      });
      const catalogueId = 1;
      const from = 1;

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          query: {
            query_string: {
              query: `*uk*`,
              fields: ["code", "name"]
            }
          },
          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );

      result.current.fetchPaginatedTrainings(catalogueId, from);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          from,
          size: SHOW_MORE_LIMIT,
          query: {
            bool: {
              must: [
                {
                  query_string: {
                    query: `*uk*`,
                    fields: ["code", "name"]
                  }
                },
                {
                  match: {
                    catalogueId: catalogueId
                  }
                }
              ]
            }
          }
        },
        esIndexNameTrainings
      );

      await waitFor(() =>
        expect(result.current.groupedTrainings).toEqual({
          1: [training2, training5]
        })
      );
    });
  });
});
