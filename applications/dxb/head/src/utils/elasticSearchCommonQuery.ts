export const getUniqueBaseProductCountCodeAggrigation = (
  _isSearch: boolean = true
) => {
  return {
    unique_base_products_count: {
      cardinality: {
        field:
          process.env.GATSBY_GROUP_BY_VARIANT === "true" || _isSearch
            ? "code.keyword"
            : "baseProduct.code.keyword"
      }
    }
  };
};

export const getCollapseVariantsByBaseProductCodeQuery = (
  _isSearch: boolean = true
) => {
  return {
    collapse: {
      field:
        process.env.GATSBY_GROUP_BY_VARIANT === "true" || _isSearch
          ? "code.keyword"
          : "baseProduct.code.keyword",
      inner_hits: {
        name: "all_variants"
      }
    }
  };
};
