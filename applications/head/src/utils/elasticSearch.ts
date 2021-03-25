import { devLog } from "../utils/devLog";

const ES_AGGREGATION_NAMES = {
  // TODO: Rename filter.name to colourfamily
  colour: "colourfamily",
  texturefamily: "texturefamily",
  productFamily: "allCategories",
  brand: "allCategories",
  // Search page - Pages tab
  "page-type-tag": "tags",
  // Search page - Documents tab
  "document-asset-type": "assetTypes"
};

export const removeIrrelevantFilters = (filters, aggregations) => {
  const newFilters = filters
    .map((filter) => {
      return {
        ...filter,
        options: filter.options.filter((option) => {
          // NOTE: all other filters are assumed to be categories
          const aggregationName =
            ES_AGGREGATION_NAMES[filter.name] || "categories";
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

  return newFilters;
};

export const disableFiltersFromAggregations = (filters, aggregations) => {
  return filters.map((filter) => {
    return {
      ...filter,
      options: filter.options.map((option) => {
        // NOTE: all other filters are assumed to be categories
        const aggregationName =
          ES_AGGREGATION_NAMES[filter.name] || "categories";
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
};

// Filter.name => ES index mapping
const searchTerms = {
  colour: "colourfamilyCode.keyword",
  texturefamily: "texturefamilyCode.keyword",
  category: "categories.code.keyword",
  // TODO: MAY NEED TO SPLIT THIS INTO A SEPARATE THING, but seems to work
  productFamily: "allCategories.code.keyword",
  brand: "allCategories.code.keyword",
  plpBaseCategory: "plpCategories.code.keyword"
};

export const compileElasticSearchQuery = (
  filters,
  // TODO: Handle this being optional differently
  categoryCode,
  page,
  pageSize,
  searchQuery?: string
): object => {
  const categoryFilters = [];

  filters.forEach((filter) => {
    // If no values chosen, ignore it
    if (!(filter.value || []).length) {
      return;
    }

    // Handle these specific filters or fallback to "category".
    const searchTerm = [
      "colour",
      "texturefamily",
      "productFamily",
      "brand"
    ].includes(filter.name)
      ? searchTerms[filter.name]
      : searchTerms.category;

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
  return {
    size: pageSize,
    from: page * pageSize,
    // NOTE: scoringWeightInt is a number (long) in the index, no ".keyword" field
    sort: [{ scoringWeightInt: "desc" }, { "name.keyword": "asc" }],
    aggs: {
      categories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "categories.code.keyword"
        }
      },
      allCategories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "allCategories.code.keyword"
        }
      },
      texturefamily: {
        terms: {
          size: "100",
          field: "texturefamilyCode.keyword"
        }
      },
      colourfamily: {
        terms: {
          size: "100",
          field: "colourfamilyCode.keyword"
        }
      }
    },
    // TODO: Join in a bool if multiple categories with multiple values
    // TODO: Still not sure how to handle this exactly
    query: {
      bool: {
        must: [
          searchQuery
            ? {
                multi_match: {
                  query: searchQuery,
                  fields: [
                    "externalProductCode",
                    "name",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    // known classification values
                    // TODO: a way of doing this generically?
                    "colourfamilyValue.keyword",
                    "texturefamilyValue.keyword",
                    "measurementValue.keyword",
                    "categories.value.keyword",
                    "plpCategories.value.keyword"
                  ]
                }
              }
            : null,
          categoryCode
            ? {
                term: {
                  [searchTerms.plpBaseCategory]: categoryCode
                }
              }
            : null,
          ...categoryFilters
        ].filter(Boolean)
      }
    }
  };
};

// Returns a query that allows us to query for total count
// Size: 0 means no actual results will be returned
// only interested in the query - pagination, aggregates, and sorting don't affect total count
export const getCountQuery = (fullQuery) => ({
  size: 0,
  query: fullQuery.query
});

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
