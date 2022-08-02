import { Filter } from "@bmi/components";
import { isDefined } from "@bmi/utils";
import { devLog } from "../utils/devLog";
import {
  generateAllowFiltersAggs,
  generateUserSelectedFilterTerms,
  getCollapseVariantsByBaseProductCodeQuery,
  getUniqueBaseProductCount
} from "./elasticSearchCommonQuery";
import { removePLPFilterPrefix } from "./product-filters";

export type Aggregations = Record<
  string,
  { buckets: { key: string; doc_count: number }[] }
>;

export const removeIrrelevantFilters = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] => {
  return (
    filters
      .map((filter) => {
        return {
          ...filter,
          options: filter.options.filter((option) => {
            // TODO: DXB-3449 - remove toUpperCase when case agnostic to be reverted!
            // eslint-disable-next-line security/detect-object-injection
            const buckets = (
              aggregations[filter.name] ||
              aggregations[filter.name.toUpperCase()]
            )?.buckets;

            const aggregate = (buckets || []).find(
              ({ key }) => key === option.value
            );

            return aggregate && aggregate.doc_count > 0;
          })
        };
      })
      // Return only filters with options
      .filter(({ options }) => options.length)
  );
};

export const disableFiltersFromAggregations = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] => {
  const aggregationsCopy: Aggregations = {};
  Object.keys(aggregations).forEach((key) => {
    // TODO: Remove lower caseing as part of DXB-3449
    // eslint-disable-next-line security/detect-object-injection
    aggregationsCopy[key.toLowerCase()] = aggregations[key];
  });
  return filters.map((filter) => {
    const buckets =
      // TODO: Remove lower caseing as part of DXB-3449
      aggregationsCopy[removePLPFilterPrefix(filter.filterCode.toLowerCase())]
        ?.buckets;

    return {
      ...filter,
      options: filter.options.map((option) => {
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
};

type Props = {
  allowFilterBy: string[];
  categoryCodes?: string[];
  filters: Filter[];
  groupByVariant: boolean;
  page: number;
  pageSize: number;
  searchQuery?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const compileElasticSearchQuery = ({
  allowFilterBy,
  categoryCodes,
  filters,
  groupByVariant,
  page,
  pageSize,
  searchQuery
}: Props) => {
  const userSelectedFilterTerms = generateUserSelectedFilterTerms(filters);

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
      ...generateAllowFiltersAggs(allowFilterBy),
      ...getUniqueBaseProductCount(groupByVariant)
    },
    query: {
      bool: {
        must: [
          searchQuery
            ? {
                query_string: {
                  query: `*${sanitiseQueryString(searchQuery)}*`,
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
                    // TODO: DXB-3449 - remove uppercasing when PIM has completed BPN-1055
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword", // this doesn't have any effect when caret boosting
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6" // boosted - (see confluence documentation, linked above)
                  ],
                  escape: true
                }
              }
            : undefined,
          categoryCodes
            ? {
                terms: {
                  ["allCategories.code.keyword"]: categoryCodes
                }
              }
            : undefined,
          ...userSelectedFilterTerms
        ].filter(isDefined)
      }
    },
    ...getCollapseVariantsByBaseProductCodeQuery(groupByVariant)
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
          ["assetType.code.keyword"]: value
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
    {
      query_string: {
        query: `false`,
        type: "cross_fields",
        fields: ["noIndex"]
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
          field: "assetType.code.keyword"
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

export const getPageQueryObject = (
  filters: Filter[],
  page: number,
  pageSize: number,
  searchQuery: string
) => {
  // Filters in the query
  // TODO: this acts like it handles many filters but actually handles one. refactor
  const filtersQuery = filters
    .filter(({ value }) => value.length)
    .map((filter) => {
      const termQuery = (value) => ({
        term: {
          ["tags.title.keyword"]: value
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
        query: `*${sanitiseQueryString(searchQuery)}*`,
        type: "cross_fields",
        fields: ["pageData"]
      }
    },
    ...filtersQuery
  ];

  return {
    size: pageSize,
    from: page * pageSize,
    _source: {
      excludes: ["pageData"]
    },
    aggs: {
      tags: {
        terms: {
          size: "100",
          field: "tags.title.keyword"
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
const sanitiseQueryString = (queryString: string) =>
  queryString.replace(/[^.,\s\p{L}\p{Nd}-]/gu, " ");
