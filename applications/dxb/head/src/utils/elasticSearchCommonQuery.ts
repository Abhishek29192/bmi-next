export const getUniqueBaseProductCountCodeAggrigation = () => {
  return {
    unique_base_products_count: {
      cardinality: {
        field: "baseProduct.code.keyword"
      }
    }
  };
};

export const getCollapseVariantsByBaseProductCodeQuery = () => {
  return {
    collapse: {
      field: "baseProduct.code.keyword",
      inner_hits: {
        name: "all_variants"
      }
    }
  };
};
