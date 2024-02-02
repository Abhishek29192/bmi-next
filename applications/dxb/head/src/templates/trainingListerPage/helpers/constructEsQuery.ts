import { Filter } from "@bmi-digital/components/filters";
import { sanitiseQueryString } from "../../../utils/elasticSearch";

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

export const constructSearchQuery = (searchQuery: string) => ({
  query_string: {
    query: searchQuery ? `*${sanitiseQueryString(searchQuery)}*` : "*",
    fields: ["courseCode", "courseName"]
  }
});
