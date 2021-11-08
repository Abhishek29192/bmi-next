import { Filter } from "@bmi/filters";
import { removePLPFilterPrefix, ProductFilter } from "./product-filters";

export type Aggregations = Record<
  string,
  { buckets: { key: string; doc_count: number }[] }
>;

export const xferFilterValue = (
  source: ProductFilter[],
  target: Filter[]
): Filter[] => {
  return target.map((tFilter) => {
    return {
      ...tFilter,
      value:
        source.find((sFilter) => sFilter.name === tFilter.name)?.value || []
    };
  });
};

export const disableFiltersFromAggregationsPLP = (
  filters: Filter[],
  aggregations: Aggregations
): Filter[] =>
  filters.map((filter) => {
    return {
      ...filter,
      options: filter.options.map((option) => {
        const buckets =
          aggregations[removePLPFilterPrefix(filter.name)]?.buckets;

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
    sort: [
      "_score",
      { productScoringWeightInt: "desc" },
      { variantScoringWeightInt: "desc" },
      { scoringWeightInt: "desc" },
      { "name.keyword": "asc" }
    ],
    aggs: {
      ...generateAllowFiltersAggs(allowFilterBy),
      ...getUniqueBaseProductCountCodeAggrigation()
    },
    query: {
      bool: {
        must: [
          {
            terms: {
              [searchTerms.allCategories]: categoryCodes
            }
          },
          ...userSelectedFilterTerms
        ].filter(Boolean)
      }
    },
    ...getCollapseVariantsByBaseProductCodeQuery()
  };
};

const getUniqueBaseProductCountCodeAggrigation = () => {
  if (process.env.GATSBY_USE_LEGACY_FILTERS === "true") {
    return {};
  }
  return {
    unique_base_products_count: {
      cardinality: {
        field: "baseProduct.code.keyword"
      }
    }
  };
};

const getCollapseVariantsByBaseProductCodeQuery = () => {
  if (process.env.GATSBY_USE_LEGACY_FILTERS === "true") {
    return {};
  }
  return {
    collapse: {
      field: "baseProduct.code.keyword",
      inner_hits: {
        name: "all_variants"
      }
    }
  };
};

const generateUserSelectedFilterTerms = (updatedFilters: Filter[]) => {
  return (updatedFilters || [])
    .filter((filter) => (filter.value || []).length > 0)
    .reduce((acc, currFilter) => {
      const termsQuery = (name, value) => ({
        terms: {
          [`${removePLPFilterPrefix(name)}.code.keyword`]: value
        }
      });
      const query = termsQuery(currFilter.name, currFilter.value);
      return [...acc, query];
    }, []);
};

const createAggregation = (categoryKey: string, optionKey: string) => {
  return {
    [categoryKey]: {
      terms: {
        // NOTE: returns 300 bucket is hopefully way more than is needed
        // if you see disabled checkbox items in the UI then check if the bucket size is smaller than the resulting values
        size: "300",
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
