export const getUniqueBaseProductCountCodeAggrigation = () => {
  return {
    unique_base_products_count: {
      cardinality: {
        field:
          process.env.GATSBY_GROUP_BY_VARIANT === "true"
            ? "code.keyword"
            : "baseProduct.code.keyword"
      }
    }
  };
};

export const getCollapseVariantsByBaseProductCodeQuery = () => {
  return {
    collapse: {
      field:
        process.env.GATSBY_GROUP_BY_VARIANT === "true"
          ? "code.keyword"
          : "baseProduct.code.keyword",
      inner_hits: {
        name: "all_variants"
      }
    }
  };
};

export const getUniqueBaseProductCount = () => {
  return {
    unique_base_products_count: {
      cardinality: {
        field: "code.keyword"
      }
    }
  };
};

export const getVariantsByBaseProductCodeQuery = () => {
  return {
    collapse: {
      field: "code.keyword",
      inner_hits: {
        name: "all_variants"
      }
    }
  };
};
