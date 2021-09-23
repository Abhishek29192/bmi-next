import { Filter } from "@bmi/filters";

export type Aggregations = Record<
  string,
  { buckets: { key: string; doc_count: number }[] }
>;

export const disableFiltersFromAggregationsPLP = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] =>
  filters.map((filter) => {
    return {
      ...filter,
      options: filter.options.map((option) => {
        const buckets = aggregations[filter.name]?.buckets;

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

const searchTerms = {
  allCategories: "allCategories.code.keyword"
};

type compileESQueryPLPArgs = {
  filters: Filter[];
  allowFilterBy: string[];
  categoryCodes: string[];
  page: number;
  pageSize: number;
};

export const compileESQueryPLP = ({
  filters: updatedFilters,
  allowFilterBy,
  categoryCodes,
  page,
  pageSize
}: compileESQueryPLPArgs): object => {
  const userSelectedFilterTerms =
    generateUserSelectedFilterTerms(updatedFilters);

  // NOTE: ES Doesn't like an empty query object
  return {
    size: pageSize,
    from: page * pageSize,
    // NOTE: scoringWeightInt is a number (long) in the index, no ".keyword" field
    sort: ["_score", { scoringWeightInt: "desc" }, { "name.keyword": "asc" }],
    aggs: {
      ...generateAllowFiltersAggs(allowFilterBy)
    },
    query: {
      bool: {
        must: [
          categoryCodes
            ? {
                terms: {
                  [searchTerms.allCategories]: categoryCodes
                }
              }
            : null,
          ...userSelectedFilterTerms
        ].filter(Boolean)
      }
    }
  };
};

const generateUserSelectedFilterTerms = (updatedFilters: Filter[]) => {
  return (updatedFilters || [])
    .filter((filter) => (filter.value || []).length > 0)
    .reduce((acc, currFilter) => {
      const termQuery = (name, value) => ({
        term: {
          [`${name.replace("plpFilter.", "")}.code.keyword`]: value
        }
      });
      const query =
        currFilter.value.length === 1
          ? termQuery(currFilter.name, currFilter.value[0])
          : {
              bool: {
                should: currFilter.value.map(termQuery)
              }
            };
      return [...acc, query];
    }, []);
};

const createAggregation = (categoryKey: string, optionKey: string) => {
  return {
    [categoryKey]: {
      terms: {
        // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
        // Could request these separately, and figure out a way of retrying and getting more buckets if needed
        size: "100",
        field: `${categoryKey}.code.keyword`,
        include: optionKey ? [optionKey] : undefined
      }
    }
  };
};

const generateAllowFiltersAggs = (allowFilterBy?: string[]): object =>
  (allowFilterBy || []).reduce(
    (acc: Record<string, { terms: { include: [] } }>, allowValue: string) => {
      const allowValueArr = allowValue.split("|");
      const categoryKey = allowValueArr[0].trim();
      const optionKey = allowValueArr[1]?.trim();
      const agg = createAggregation(categoryKey, optionKey);
      if (optionKey) {
        const include = acc[categoryKey]?.terms?.include || [];
        // eslint-disable-next-line security/detect-object-injection
        agg[categoryKey].terms.include = [...include, optionKey];
      }

      return {
        ...acc,
        ...agg
      };
    },
    {}
  );
