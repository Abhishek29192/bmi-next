import { Product } from "../../../../../libraries/firestore-types/src";
import { isDefined } from "../../../../../libraries/utils/src";
import { ProductFilter } from "../../../types/pim";
import {
  extractAllowedCategories,
  extractAllowedFeatures,
  generateFilters
} from "../../../utils/product-filters";

export type PlpFiltersArgs = {
  products: readonly Product[];
  allowedFilters?: string[];
};

export const getPlpFilters = ({
  products,
  allowedFilters
}: PlpFiltersArgs): ProductFilter[] => {
  if (
    !allowedFilters ||
    !products ||
    allowedFilters.length === 0 ||
    products.length === 0
  )
    return [];

  // extract categorynames and feature names from allowedFilters ONLY once
  const categoryAllowedFilters = extractAllowedCategories(allowedFilters);

  // process classification filters here
  const classificationAllowedFilters = extractAllowedFeatures(allowedFilters);

  const allFilters = generateFilters(
    products.flatMap((product) => product.filters),
    categoryAllowedFilters,
    classificationAllowedFilters
  );

  if (allFilters.length > 0) {
    const uniqueAllowFilterKeys = Array.from(
      new Set(allowedFilters.map((filter) => filter.split("|")[0].trim()))
    );
    console.log("======================================");
    console.log(`All filters: ${JSON.stringify(allFilters)}`);
    console.log(
      `Unique allow filters: ${JSON.stringify(uniqueAllowFilterKeys)}`
    );
    console.log("======================================");
    //order them in the `allowFilterBy` specified order
    return uniqueAllowFilterKeys
      .map((uniqueFilter) =>
        allFilters.find(
          // TODO: Remove upper caseing as part of DXB-3449
          ({ name }) => name.toUpperCase() === uniqueFilter.toUpperCase()
        )
      )
      .filter(isDefined);
  }
  return [];
};
