import { Filter } from "@bmi-digital/components";

export const constructFiltersQuery = (filters: Filter[]) => {
  const selectedFilters = filters.filter((filter) => filter.value?.length);

  if (!selectedFilters.length) {
    return [];
  }

  return selectedFilters.map((filter) => ({
    terms: {
      [`${filter.filterCode}.keyword`]: filter.value
    }
  }));
};

export const constructSearchQuery = (searchQuery: string | null) => ({
  query_string: {
    query: searchQuery ? `*${searchQuery}*` : "*",
    fields: ["code", "name"]
  }
});
