import { Filter } from "@bmi-digital/components";

export const xferFilterValue = (
  source: Filter[],
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
