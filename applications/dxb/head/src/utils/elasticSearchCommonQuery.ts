import { Filter } from "@bmi-digital/components/filters";
import { removePLPFilterPrefix } from "./product-filters";

export const getCollapseVariantsByBaseProductCodeQuery = (
  groupByVariant: boolean
) => {
  return {
    collapse: {
      field: groupByVariant ? "code.keyword" : "baseProduct.code.keyword",
      inner_hits: {
        name: "all_variants",
        size: 100 // by default ES returns first 3 hits. Increase it to 100 to be consistent with other product queries
      }
    }
  };
};

export const getUniqueBaseProductCount = (groupByVariant: boolean) => {
  return {
    unique_base_products_count: {
      cardinality: {
        field: groupByVariant ? "code.keyword" : "baseProduct.code.keyword"
      }
    }
  };
};

export const generateUserSelectedFilterTerms = (filters: Filter[]) => {
  return (filters || [])
    .filter((filter) => (filter.value || []).length > 0)
    .reduce(
      (acc: { terms: { [x: string]: readonly string[] } }[], currFilter) => {
        const termsQuery = (name: string, value: readonly string[]) => ({
          terms: {
            // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
            [`${removePLPFilterPrefix(name).toUpperCase()}.code.keyword`]: value
          }
        });
        const query = termsQuery(currFilter.name, currFilter.value || []);
        return [...acc, query];
      },
      []
    );
};

export const generateAllowFiltersAggs = (allowFilterBy?: string[]) =>
  (allowFilterBy || []).reduce(
    (acc: Record<string, { terms: { include: [] } }>, allowValue: string) => {
      const allowValueArr = allowValue.split("|");
      const categoryKey = allowValueArr[0].trim().toUpperCase();
      const optionKey = allowValueArr[1]?.trim();
      const agg = createAggregation(
        categoryKey,
        // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
        optionKey?.includes(".") ? optionKey.toUpperCase() : optionKey
      );
      if (optionKey) {
        // eslint-disable-next-line security/detect-object-injection
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
