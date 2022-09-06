import { Filter } from "@bmi/components";
import QueryString from "query-string";
import { useEffect, useState } from "react";
import { ProductFilter } from "../types/pim";
import { getPathWithCountryCode } from "../utils/path";
import { removePLPFilterPrefix } from "./product-filters";

export type URLFilter = {
  name: string;
  value: string[];
};

export type URLProductFilter = URLFilter;

export type ResultType = "Simple" | "Technical" | "Card Collection";

export type Source = "PIM" | "CMS" | "ALL";

export enum SourceEnum {
  PIM = "PIM",
  CMS = "CMS",
  ALL = "ALL"
}

export const convertToURLFilters = (
  filters: readonly Filter[]
): URLProductFilter[] => {
  return filters.reduce((carry, { name, value }) => {
    if (value && value.length) {
      carry.push({ name: removePLPFilterPrefix(name), value });
    }
    return carry;
  }, []);
};

export const uniqueByCode = (uniqueObjects, object) => {
  uniqueObjects.find((unique) => unique.code === object.code) ||
    uniqueObjects.push(object);
  return uniqueObjects;
};

export const sortAlphabeticallyBy = (propName) => (a, b) => {
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] < b[propName]) {
    return -1;
  }
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

export const updateFilterValue = (
  filters,
  filterName,
  filterValue,
  checked
) => {
  const addToArray = (array, value) => [...array, value];
  const removeFromArray = (array, value) => array.filter((v) => v !== value);
  const getNewValue = (filter, checked, value) => {
    return checked
      ? addToArray(filter.value || [], value)
      : removeFromArray(filter.value || [], value);
  };

  return filters.map((filter) => {
    return {
      ...filter,
      value:
        filter.name === filterName
          ? getNewValue(filter, checked, filterValue)
          : filter.value
    };
  });
};

export const clearFilterValues = (filters) => {
  return filters.map((filter) => ({
    ...filter,
    value: []
  }));
};

export const FILTER_KEY = "filters";
export const PATHNAME_KEY = "pathname";
export const SEARCHTAB_KEY = "tab";

type FiltersLocation = { search: string; pathname: string };

export const getURLFilterValues = (): URLProductFilter[] => {
  const { search } = getWindowLocationFilters();
  const filters = QueryString.parse(search)[FILTER_KEY.toString()];

  if (filters) {
    try {
      return JSON.parse(filters.toString());
    } catch (error) {
      // user may change url params so JSON.parse fails
      console.error("Filters can not be parsed");
    }
  }
  return [];
};

export const getUpdatedFilters = (filters: Filter[]): Filter[] => {
  const newFilterValues = getURLFilterValues();

  const updatedFilters = filters.map((filter) => {
    const currentQueryFilterValue = newFilterValues.find(
      ({ name }) => name === removePLPFilterPrefix(filter.name)
    )?.value;

    return {
      ...filter,
      value: [].concat(currentQueryFilterValue).filter(Boolean)
    };
  });

  return updatedFilters;
};

export const setFiltersUrl = (newFilters: Filter[]): void => {
  const location = getWindowLocationFilters();
  const newUrlFilterValues = convertToURLFilters(newFilters as ProductFilter[]);
  const newFilterNames = newFilters.map(({ name }) => name);

  const urlFilterValues = getURLFilterValues();

  newFilterNames.forEach((name) => {
    const index: number = urlFilterValues.findIndex(
      (filter) => filter.name === name
    );
    const value = newUrlFilterValues.find(
      (value) => value.name === name
    )?.value;

    if (index === -1) {
      urlFilterValues.push({ name, value });
    } else {
      urlFilterValues[index as number] = { name, value };
    }
  });

  const urlParams = urlFilterValues.filter(({ value }) =>
    Boolean(value?.length)
  );

  const params = QueryString.parse(location.search);

  if (urlParams.length > 0) {
    params[FILTER_KEY as string] = JSON.stringify(urlParams);
  } else {
    delete params[FILTER_KEY as string];
  }

  replaceHistoryState({
    pathname: location.pathname,
    search: QueryString.stringify(params)
  });
};

export const setSearchTabUrl = (tab: string): void => {
  const location = getWindowLocationFilters();
  const params = QueryString.parse(location.search);

  params[SEARCHTAB_KEY as string] = tab;

  replaceHistoryState({
    pathname: location.pathname,
    search: QueryString.stringify(params)
  });
};

export const getSearchTabUrl = (): string => {
  const { search } = getWindowLocationFilters();
  const searchtab = QueryString.parse(search)[SEARCHTAB_KEY as string] ?? null;

  return Array.isArray(searchtab) ? searchtab[0] : searchtab;
};

export const REPLACE_STATE_EVENT = "onreplacestate";
const replaceHistoryState = ({
  pathname,
  search
}: {
  pathname: string;
  search: string;
}) => {
  const event = new CustomEvent(REPLACE_STATE_EVENT, {
    detail: {
      search
    }
  });
  typeof window !== "undefined" && window.dispatchEvent(event);
  history.replaceState(null, null, `${pathname}?${search}`);
};

export const useSearchParams = (): string => {
  const [params, setParams] = useState(getSearchParams());

  const onPopState = (e: CustomEvent) => {
    setParams(getSearchParams(e.detail.search));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener(REPLACE_STATE_EVENT, onPopState);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(REPLACE_STATE_EVENT, onPopState);
      }
    };
  }, []);

  return params;
};

export const getSearchParams = (search?: string) => {
  const params = QueryString.parse(search || getWindowLocationFilters().search);

  params[PATHNAME_KEY.toString()] = location.pathname;

  return `?${QueryString.stringify(params)}`;
};

export const getBackToResultsPath = (countryCode: string): string => {
  const location = getWindowLocationFilters();
  const params = QueryString.parse(location.search);

  const pathname = params[PATHNAME_KEY.toString()];
  if (pathname) {
    delete params[PATHNAME_KEY.toString()];
    return params && Object.keys(params).length > 0
      ? `${pathname}?${QueryString.stringify(params)}`
      : `${pathname}`;
  }
  return `${getPathWithCountryCode(countryCode, "search")}${location.search}`;
};

export const getWindowLocationFilters = (): FiltersLocation =>
  typeof window !== "undefined"
    ? window.location
    : { search: "", pathname: "" };
