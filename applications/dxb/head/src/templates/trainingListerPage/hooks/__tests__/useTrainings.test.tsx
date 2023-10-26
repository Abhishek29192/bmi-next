import React from "react";
import { Filter as FilterType } from "@bmi-digital/components";
import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import { createTraining } from "@bmi/elasticsearch-types";
import { useTrainings } from "../useTrainings";
import { Config, ConfigProvider } from "../../../../contexts/ConfigProvider";
import {
  disableFiltersFromAggregations,
  queryElasticSearch
} from "../../../../utils/elasticSearch";
import { SHOW_MORE_LIMIT } from "../../constants";
import {
  PaginatedTrainingResponse,
  CollapsedTrainingResponse
} from "../../types";

const esIndexNameTrainings = "dxb-all-trainings_read";

const training1 = createTraining({
  id: "1-1",
  catalogueId: "1",
  courseId: 1
});
const training2 = createTraining({
  id: "2-1",
  code: "uk-catalog",
  name: "uk-catalog",
  catalogueId: "1",
  courseId: 2
});
const training3 = createTraining({
  id: "3-2",
  code: "no-catalog",
  name: "no-catalog",
  catalogueId: "2",
  courseId: 3
});
const training4 = createTraining({
  id: "4-1",
  code: "IT-catalog",
  name: "IT-catalog",
  catalogueId: "1",
  courseId: 4
});
const training5 = createTraining({
  id: "5-1",
  code: "uk-catalog",
  name: "uk-catalog",
  catalogueId: "1",
  courseId: 5
});

const collapsedTrainingsResponse: CollapsedTrainingResponse = {
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
  },
  aggregations: {}
};

const paginatedEsResponse: PaginatedTrainingResponse = {
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

const filters: FilterType[] = [
  {
    filterCode: "filter1",
    label: "filter1",
    name: "filter1",
    value: ["filter-value-1"],
    options: [
      {
        value: "filter-value-1",
        label: "Filter Label 1"
      },
      {
        value: "filter-value-2",
        label: "Filter Label 2"
      }
    ]
  }
];

const queryElasticsearchMock = jest.fn();
jest.mock("../../../../utils/elasticSearch", () => ({
  queryElasticSearch: (...args: Parameters<typeof queryElasticSearch>) =>
    queryElasticsearchMock(...args),
  disableFiltersFromAggregations: jest
    .fn()
    .mockImplementation((filters, _aggregations) => filters)
}));

const render = ({
  configOverride = { esIndexNameTrainings }
}: {
  configOverride?: Partial<Config>;
} = {}) => {
  const Wrapper = ({ children }: { children: JSX.Element }) => (
    <ConfigProvider configOverride={configOverride}>{children}</ConfigProvider>
  );

  return renderHook(() => useTrainings({ defaultFilters: filters }), {
    wrapper: Wrapper
  });
};

afterEach(() => {
  jest.clearAllMocks();

  Object.defineProperty(window, "location", {
    value: {
      search: ""
    },
    writable: true
  });
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
          query: {
            bool: {
              must: [
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
            }
          }
        },
        esIndexNameTrainings
      );

      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      expect(disableFiltersFromAggregations).toHaveBeenCalledTimes(1);
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
          query: {
            bool: {
              must: [
                { terms: { ["filter1.keyword"]: ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
            }
          }
        },
        esIndexNameTrainings
      );
      expect(result.current.groupedTrainings).toEqual({});
      expect(result.current.total).toEqual({});
      expect(disableFiltersFromAggregations).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(error);
    });

    it("should not call 'queryElasticsearchMock' if 'esIndexNameTrainings' does not exist", async () => {
      const { result } = render({
        configOverride: { esIndexNameTrainings: undefined }
      });
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      expect(queryElasticsearchMock).not.toHaveBeenCalled();
      expect(disableFiltersFromAggregations).not.toHaveBeenCalled();
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

      result.current.fetchPaginatedTrainings("1", 1);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).not.toHaveBeenCalled();
      expect(result.current.groupedTrainings).toEqual({});
      expect(result.current.total).toEqual({});
    });

    it("groups trainings correctly if 'fetchPaginatedTrainings' pulls trainings", async () => {
      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsResponse)
        .mockResolvedValueOnce(paginatedEsResponse);
      const catalogueId = "1";
      const from = 1;

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          query: {
            bool: {
              must: [
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
            }
          }
        },
        esIndexNameTrainings
      );

      await result.current.fetchPaginatedTrainings(catalogueId, from);
      //checks whether queryElasticsearch has been called on 'fetchPaginatedTrainings' function call
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          from,
          size: SHOW_MORE_LIMIT,
          query: {
            bool: {
              must: [
                {
                  match: {
                    "catalogueId.keyword": catalogueId
                  }
                },
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
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
          1: [training1, training2, training4, training5],
          2: [training3]
        })
      );
    });

    it("works correctly if 'queryElasticsearch' throws an error", async () => {
      const error = new Error("Expected error");
      const catalogueId = "1";
      const from = 1;

      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsResponse)
        .mockRejectedValueOnce(error);

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          query: {
            bool: {
              must: [
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
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
                  match: {
                    "catalogueId.keyword": catalogueId
                  }
                },
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
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

      const collapsedTrainingsResponse: CollapsedTrainingResponse = {
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
        },
        aggregations: {}
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

  describe("training list search", () => {
    it("should return searched training results for query_string as *uk* on page mount if corresponding search query provided", async () => {
      Object.defineProperty(window, "location", {
        value: {
          search: "?q=uk"
        },
        writable: true
      });

      queryElasticsearchMock.mockResolvedValue(collapsedTrainingsResponse);

      const { result } = render();
      await waitFor(() =>
        expect(queryElasticsearchMock).toHaveBeenCalledWith(
          {
            query: {
              bool: {
                must: [
                  {
                    terms: {
                      "filter1.keyword": ["filter-value-1"]
                    }
                  },
                  {
                    query_string: {
                      query: "*uk*",
                      fields: ["code", "name"]
                    }
                  }
                ]
              }
            },
            collapse: {
              field: "catalogueId.keyword",
              inner_hits: {
                name: "inner_hits",
                size: SHOW_MORE_LIMIT
              }
            },
            aggs: {
              catalogueId: {
                terms: {
                  size: "10",
                  field: "catalogueId.keyword"
                }
              },
              category: {
                terms: {
                  size: "15",
                  field: "category.keyword"
                }
              }
            }
          },
          esIndexNameTrainings
        )
      );
      await waitFor(() => expect(result.current.initialLoading).toBe(false));

      expect(result.current.groupedTrainings).toEqual({
        1: [training1, training2],
        2: [training3]
      });

      expect(result.current.total).toEqual({ 1: 2, 2: 1 });
    });
  });

  describe("training list search - fetchPaginatedTrainings", () => {
    it("groups trainings correctly if 'fetchPaginatedTrainings' pulls trainings and search query provided", async () => {
      queryElasticsearchMock
        .mockResolvedValueOnce(collapsedTrainingsResponse)
        .mockResolvedValueOnce(paginatedEsResponse);
      Object.defineProperty(window, "location", {
        value: {
          search: "?q=uk"
        },
        writable: true
      });
      const catalogueId = "1";
      const from = 1;

      const { result } = render();
      await waitFor(() => expect(result.current.initialLoading).toBe(false));
      //checks whether queryElasticsearch has been called on mount
      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          query: {
            bool: {
              must: [
                {
                  terms: {
                    "filter1.keyword": ["filter-value-1"]
                  }
                },
                {
                  query_string: {
                    query: "*uk*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
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
                  match: {
                    "catalogueId.keyword": catalogueId
                  }
                },
                { terms: { "filter1.keyword": ["filter-value-1"] } },
                {
                  query_string: {
                    query: "*uk*",
                    fields: ["code", "name"]
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
          1: [training1, training2],
          2: [training3]
        })
      );

      expect(result.current.total).toEqual({ 1: 2, 2: 1 });
    });
  });

  describe("handleFiltersChange", () => {
    it("works correctly when the user changes filters", async () => {
      const { result } = render();

      await result.current.handleFiltersChange(
        filters[0].filterCode,
        "filter-value-2",
        true
      );

      expect(queryElasticsearchMock).toHaveBeenCalledWith(
        {
          query: {
            bool: {
              must: [
                {
                  terms: {
                    "filter1.keyword": ["filter-value-1", "filter-value-2"]
                  }
                },
                {
                  query_string: {
                    query: "*",
                    fields: ["code", "name"]
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
            }
          }
        },
        esIndexNameTrainings
      );
      expect(result.current.filters).toEqual([
        {
          filterCode: "filter1",
          label: "filter1",
          name: "filter1",
          value: ["filter-value-1", "filter-value-2"],
          options: [
            {
              value: "filter-value-1",
              label: "Filter Label 1"
            },
            {
              value: "filter-value-2",
              label: "Filter Label 2"
            }
          ]
        }
      ]);
    });
  });

  describe("handleResetFilters", () => {
    it("resets filters correctly", async () => {
      const { result } = render();

      //changas the filter value
      await result.current.handleFiltersChange(
        filters[0].filterCode,
        "filter-value-2",
        true
      );
      expect(result.current.filters).toEqual([
        {
          filterCode: "filter1",
          label: "filter1",
          name: "filter1",
          value: ["filter-value-1", "filter-value-2"],
          options: [
            {
              value: "filter-value-1",
              label: "Filter Label 1"
            },
            {
              value: "filter-value-2",
              label: "Filter Label 2"
            }
          ]
        }
      ]);

      await result.current.handleResetFilters();
      expect(result.current.filters).toEqual([
        {
          filterCode: "filter1",
          label: "filter1",
          name: "filter1",
          value: ["filter-value-1"],
          options: [
            {
              value: "filter-value-1",
              label: "Filter Label 1"
            },
            {
              value: "filter-value-2",
              label: "Filter Label 2"
            }
          ]
        }
      ]);
    });
  });
});
