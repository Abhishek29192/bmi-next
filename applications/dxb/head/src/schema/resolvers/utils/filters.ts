import { isDefined } from "@bmi/utils";
import type { Product } from "@bmi/firestore-types";
import { replaceDotFiltersParameter } from "../../../utils/filters";
import {
  extractAllowedCategories,
  extractAllowedFeatures,
  generateFilters
} from "../../../utils/product-filters";
import type { ProductFilter } from "../../../types/pim";

export type PlpFiltersArgs = {
  products: readonly Product[];
  allowedFilters: string[];
  microCopies: Map<string, string>;
};

export const getPlpFilters = ({
  products,
  allowedFilters,
  microCopies
}: PlpFiltersArgs): ProductFilter[] => {
  if (allowedFilters.length === 0 || products.length === 0) {
    return [];
  }

  // extract categorynames and feature names from allowedFilters ONLY once
  const categoryAllowedFilters = extractAllowedCategories(allowedFilters);

  // process classification filters here
  const classificationAllowedFilters = extractAllowedFeatures(allowedFilters);

  const allFilters = generateFilters(
    products.flatMap((product) => product.filters),
    categoryAllowedFilters,
    classificationAllowedFilters,
    microCopies
  );

  if (allFilters.length > 0) {
    const uniqueAllowFilterKeys = Array.from(
      new Set(allowedFilters.map((filter) => filter.split("|")[0].trim()))
    );
    //order them in the `allowFilterBy` specified order
    return uniqueAllowFilterKeys
      .map((uniqueFilter) =>
        allFilters.find(
          // TODO: Remove upper caseing as part of DXB-3449
          ({ name }) => name?.toUpperCase() === uniqueFilter.toUpperCase()
        )
      )
      .filter(isDefined);
  }
  return [];
};

export const transformFilterKeys = (filters: string[]): string[] =>
  filters.map((filter) => replaceDotFiltersParameter(filter));
