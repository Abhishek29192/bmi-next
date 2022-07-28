import { Filter } from "@bmi/components";
import { ProductFilter } from "../types/pim";

export const xferFilterValue = (
  source: ProductFilter[],
  target: Filter[]
): Filter[] => {
  return target.map((tFilter) => {
    return {
      ...tFilter,
      value:
        source.find((sFilter) => sFilter.filterCode === tFilter.filterCode)
          ?.value || []
    };
  });
};
