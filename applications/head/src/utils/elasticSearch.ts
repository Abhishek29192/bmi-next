import { devLog } from "../utils/devLog";

const ES_INDEX_NAME = "nodetest_v3_products";

export const disableFiltersFromAggregations = (filters, aggregations) => {
  const aggregationNames = {
    // TODO: Rename filter.name to colourfamily
    colour: "colourfamily",
    texturefamily: "texturefamily",
    productFamily: "otherCategories"
  };

  return filters.map((filter) => {
    return {
      ...filter,
      options: filter.options.map((option) => {
        // NOTE: all other filters are assumed to be categories
        const aggregationName = aggregationNames[filter.name] || "categories";
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

export const compileElasticSearchQuery = (
  filters,
  categoryCode,
  page,
  pageSize
): object => {
  const categoryFilters = [];

  const searchTerms = {
    colour: "colourfamilyCode.keyword",
    texturefamily: "texturefamilyCode.keyword",
    category: "categories.code.keyword",
    // TODO: MAY NEED TO SPLIT THIS INTO A SEPARATE THING, but seems to work
    productFamily: "otherCategories.code.keyword",
    otherCategories: "otherCategories.code.keyword"
  };

  filters.forEach((filter) => {
    // If no values chosen, ignore it
    if (!filter.value.length) {
      return;
    }

    if (filter.name === "colour") {
      const colourTermQuery = (value) => ({
        term: {
          [searchTerms.colour]: value
        }
      });
      const coloursQuery =
        filter.value.length === 1
          ? colourTermQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(colourTermQuery)
              }
            };

      categoryFilters.push(coloursQuery);
    } else if (filter.name === "texturefamily") {
      const textureTermQuery = (value) => ({
        term: {
          [searchTerms.texturefamily]: value
        }
      });
      const texturesQuery =
        filter.value.length === 1
          ? textureTermQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(textureTermQuery)
              }
            };

      categoryFilters.push(texturesQuery);
      // TODO: This is at this point generic
    } else if (filter.name === "productFamily") {
      const queryTerm = (value) => ({
        term: {
          [searchTerms.productFamily]: value
        }
      });
      const query =
        filter.value.length === 1
          ? queryTerm(filter.value[0])
          : {
              bool: {
                should: filter.value.map(queryTerm)
              }
            };

      categoryFilters.push(query);
    } else {
      const categoriesQuery =
        filter.value.length === 1
          ? {
              term: {
                [searchTerms.category]: filter.value[0]
              }
            }
          : {
              bool: {
                should: filter.value.map((value) => ({
                  term: {
                    [searchTerms.category]: value
                  }
                }))
              }
            };

      categoryFilters.push(categoriesQuery);
    }
  });

  // NOTE: ES Doesn't like an empty query object
  return {
    size: pageSize,
    from: page * pageSize,
    sort: [{ "scoringWeight.keyword": "desc" }, { "name.keyword": "asc" }],
    aggs: {
      categories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "categories.code.keyword"
        }
      },
      otherCategories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "otherCategories.code.keyword"
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
          {
            term: {
              [searchTerms.otherCategories]: categoryCode
            }
          },
          ...categoryFilters
        ]
      }
    }
  };
};

export const queryElasticSearch = async (query = {}) => {
  const url = `${process.env.GATSBY_ES_ENDPOINT}/${ES_INDEX_NAME}/_search`;

  if (window.fetch) {
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: `Basic ${btoa(
            `${process.env.GATSBY_ES_USERNAME}:${process.env.GATSBY_ES_PASSWORD}`
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
