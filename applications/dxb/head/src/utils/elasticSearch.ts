import { Filter } from "@bmi/components";
import { devLog } from "../utils/devLog";
import {
  getVariantsByBaseProductCodeQuery,
  getUniqueBaseProductCount
} from "./elasticSearchCommonQuery";

const ES_AGGREGATION_NAMES = {
  // TODO: Rename filter.name to colourfamily
  colour: "colourfamily",
  materials: "materials",
  texturefamily: "texturefamily",
  productFamily: "allCategories",
  productLine: "allCategories",
  brand: "allCategories",
  // Search page - Pages tab
  "page-type-tag": "tags",
  // Search page - Documents tab
  "document-asset-type": "assetTypes"
};

export type Aggregations = Record<
  string,
  { buckets: { key: string; doc_count: number }[] }
>;

export const removeIrrelevantFilters = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] =>
  filters
    .map((filter) => {
      return {
        ...filter,
        options: filter.options.filter((option) => {
          // NOTE: all other filters are assumed to be categories
          const aggregationName =
            ES_AGGREGATION_NAMES[filter.name] || "allCategories";
          // eslint-disable-next-line security/detect-object-injection
          const buckets = aggregations[aggregationName]?.buckets;

          const aggregate = (buckets || []).find(
            ({ key }) => key === option.value
          );

          return aggregate && aggregate.doc_count > 0;
        })
      };
    })
    // Return only filters with options
    .filter(({ options }) => options.length);

export const disableFiltersFromAggregations = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] =>
  filters.map((filter) => {
    return {
      ...filter,
      options: filter.options.map((option) => {
        // NOTE: all other filters are assumed to be categories
        const aggregationName =
          ES_AGGREGATION_NAMES[filter.name] || "allCategories";
        // eslint-disable-next-line security/detect-object-injection
        const buckets = aggregations[aggregationName]?.buckets;

        const aggregate = (buckets || []).find(
          ({ key }) => key === option.value
        );

        return {
          ...option,
          isDisabled: !(aggregate && aggregate.doc_count > 0)
        };
      })
    };
  });

// Filter.name => ES index mapping
const searchTerms = {
  colour: "appearanceAttributes.colourfamily.code.keyword",
  materials: "generalInformation.materials.code.keyword",
  texturefamily: "appearanceAttributes.texturefamily.code.keyword",
  allCategories: "allCategories.code.keyword"
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const compileElasticSearchQuery = (
  filters: Filter[],
  // TODO: Handle this being optional differently
  categoryCodes: string[],
  page: number,
  pageSize: number,
  searchQuery?: string
) => {
  const categoryFilters = [];

  filters.forEach((filter) => {
    // If no values chosen, ignore it
    if (!(filter.value || []).length) {
      return;
    }

    // Handle these specific filters or fallback to "category".
    const searchTerm = [
      "colour",
      "materials",
      "texturefamily",
      "productFamily",
      "productLine",
      "brand"
    ].includes(filter.name)
      ? searchTerms[filter.name] || searchTerms.allCategories
      : searchTerms.allCategories;

    const termQuery = (value) => ({
      term: {
        [searchTerm]: value
      }
    });
    const query =
      filter.value.length === 1
        ? termQuery(filter.value[0])
        : {
            bool: {
              should: filter.value.map(termQuery)
            }
          };

    categoryFilters.push(query);
  });

  // NOTE: ES Doesn't like an empty query object
  const queryString = `*${searchQuery?.replace(/[^.,\s\p{L}\p{Nd}-]/gu, " ")}*`;
  return {
    size: pageSize,
    from: page * pageSize,
    // NOTE: scoringWeightInt is a number (long) in the index, no ".keyword" field
    sort: [
      "_score",
      { productScoringWeightInt: "desc" },
      { variantScoringWeightInt: "desc" },
      { "name.keyword": "asc" }
    ],
    aggs: {
      allCategories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "allCategories.code.keyword"
        }
      },
      materials: {
        terms: {
          size: "100",
          field: "generalInformation.materials.code.keyword"
        }
      },
      texturefamily: {
        terms: {
          size: "100",
          field: "appearanceAttributes.texturefamily.code.keyword"
        }
      },
      colourfamily: {
        terms: {
          size: "100",
          field: "appearanceAttributes.colourfamily.code.keyword"
        }
      },
      ...getUniqueBaseProductCount()
    },
    // TODO: Join in a bool if multiple categories with multiple values
    // TODO: Still not sure how to handle this exactly
    query: {
      bool: {
        must: [
          searchQuery
            ? {
                query_string: {
                  query: queryString,
                  // when caret boosting multi_match queries, "cross_fields" seems to work the best for us currently
                  // https://bmigroup.atlassian.net/wiki/spaces/DXB/pages/2512847139/Tuning+Search+Relevance
                  type: "cross_fields",
                  fields: [
                    "externalProductCode",
                    "name^5", // boosted - (see confluence documentation, linked above)
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "appearanceAttributes.colourfamily.name.keyword", // this doesn't have any effect when caret boosting
                    "generalInformation.materials.name.keyword",
                    "appearanceAttributes.texturefamily.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6" // boosted - (see confluence documentation, linked above)
                  ]
                }
              }
            : null,
          categoryCodes
            ? {
                terms: {
                  [searchTerms.allCategories]: categoryCodes
                }
              }
            : null,
          ...categoryFilters
        ].filter(Boolean)
      }
    },
    ...getVariantsByBaseProductCodeQuery()
  };
};

// Returns a query that allows us to query for total count
// Size: 0 means no actual results will be returned
// only interested in the query - pagination, aggregates, and sorting don't affect total count
export const getCountQuery = (fullQuery) => ({
  size: 0,
  query: fullQuery.query,
  aggs: fullQuery.aggs
});

export const getDocumentQueryObject = (
  queryString,
  pageSize,
  page = 0,
  filters = []
) => {
  // Filters in the query
  // TODO: this acts like it handles many filters but actually handles one. refactor
  const filtersQuery = filters
    .filter(({ value }) => value.length)
    .map((filter) => {
      const termQuery = (value) => ({
        term: {
          ["assetType.pimCode.keyword"]: value
        }
      });
      const query =
        filter.value.length === 1
          ? termQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(termQuery)
              }
            };

      return query;
    });

  const queryElements = [
    {
      query_string: {
        query: `*${queryString}*`,
        type: "cross_fields",
        fields: ["title"]
      }
    },
    ...filtersQuery
  ];

  return {
    size: pageSize,
    from: page * pageSize,
    sort: [{ "assetType.name.keyword": "asc", "title.keyword": "asc" }],
    aggs: {
      assetTypes: {
        terms: {
          size: "100",
          field: "assetType.pimCode.keyword"
        }
      },
      total: {
        cardinality: {
          field: "titleAndSize.keyword"
        }
      }
    },
    query:
      queryElements.length === 1
        ? queryElements[0]
        : {
            bool: {
              must: queryElements
            }
          },
    collapse: {
      field: "titleAndSize.keyword"
    }
  };
};

export const queryElasticSearch = async (query = {}, indexName: string) => {
  const url = `${process.env.GATSBY_ES_ENDPOINT}/${indexName}/_search`;

  if (window.fetch) {
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: `ApiKey ${btoa(
            `${process.env.GATSBY_ES_API_KEY_ID}:${process.env.GATSBY_ES_API_KEY}`
          )}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(query)
      });

      const content = await response.json();

      if (!response.ok) {
        devLog(`ERROR: ${response.status}, ${response.statusText}`);
      }
      return content;
    } catch (error) {
      devLog("Error fetching ES", error);
    }
  } else {
    devLog("NO fetch");
  }
};
