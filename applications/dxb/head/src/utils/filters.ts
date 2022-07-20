import { Filter } from "@bmi/components";
import QueryString from "query-string";
import { useEffect, useState } from "react";
import { DocumentResultData } from "../templates/documentLibrary/components/DocumentResults";
import { ContentfulDocument as ContentfulDocumentData } from "../types/Document";
import {
  ProductDocument as PIMDocument,
  ProductFilter,
  SystemDocument as PIMSystemDocument
} from "../types/pim";
import { getPathWithCountryCode } from "../utils/path";
import { removePLPFilterPrefix } from "./product-filters";

export type URLProductFilter = {
  name: string;
  value: string[];
};

export type ResultType = "Simple" | "Technical" | "Card Collection";

export type Source = "PIM" | "CMS" | "ALL";

export enum SourceEnum {
  PIM = "PIM",
  CMS = "CMS",
  ALL = "ALL"
}

const isPIMDocument = (
  item: DocumentResultData
): item is PIMDocument | PIMSystemDocument => {
  return ["PIMDocument", "PIMSystemDocument"].includes(item.__typename);
};

export const convertToURLFilters = (
  filters: readonly ProductFilter[]
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

//TODO: this should be done with ES query!!
// there is a card for this task in backlog
// this will be done when documents are indexed in ES with products
export const filterDocuments = (
  documents: (PIMDocument | ContentfulDocumentData)[],
  filters: Array<Filter>
): (PIMDocument | ContentfulDocumentData)[] => {
  const valueMatcher = {
    // TODO: Replace productFilters usage with productBrandCode
    brand: (document: DocumentResultData, valuesToMatch: string[]): boolean => {
      const isPimDoc = isPIMDocument(document);
      if (isPimDoc) {
        const brandFilterValues = (document as PIMDocument).productFilters
          .filter((productFilter) => productFilter.filterCode === "Brand")
          .map((filter) => filter.value);
        if (!brandFilterValues || brandFilterValues.length === 0) {
          return false;
        } else {
          return brandFilterValues.some((filterValue) =>
            valuesToMatch.includes(filterValue)
          );
        }
      } else {
        //contentful documents have brand property to match with
        const documentBrand = document["brand"];
        return valuesToMatch.includes(documentBrand);
      }
    },
    // TODO: Replace productFilters usage with productProductFamily
    productfamily: (
      document: DocumentResultData,
      valuesToMatch: string[]
    ): boolean => {
      const isPimDoc = isPIMDocument(document);
      if (isPimDoc) {
        const productFamilyFilter = (document as PIMDocument).productFilters
          .filter(
            (productFilter) => productFilter.filterCode === "ProductFamily"
          )
          .map((filter) => filter.value);
        if (!productFamilyFilter || productFamilyFilter.length === 0) {
          return false;
        } else {
          return productFamilyFilter.some((filterValue) =>
            valuesToMatch.includes(filterValue)
          );
        }
      }
      //cater for other types of documents!!
      return false;
    },
    contentfulassettype: (
      document: DocumentResultData,
      valuesToMatch: string[]
    ): boolean => {
      return valuesToMatch.includes(document["assetType"]["code"]);
    },
    genericCategory: (
      document: DocumentResultData,
      filterName: string,
      valuesToMatch: string[]
    ): boolean => {
      const isPimDoc = isPIMDocument(document);
      if (isPimDoc) {
        const categoryCodes = (document as PIMDocument).productCategories.map(
          (category) => category.code
        );
        const result = categoryCodes.some((code) =>
          valuesToMatch.includes(code)
        );

        if (!result) {
          const categoryWithName = (
            document as PIMDocument
          ).productCategories.find(
            (category) =>
              category.parentCategoryCode === filterName ||
              category.code === filterName
          );
          if (categoryWithName) {
            if (valuesToMatch.includes(categoryWithName.code)) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return result;
        }
      }
      //cater for other types of documents!!
      return false;
    },
    "filterlabels.assettype": (
      document: DocumentResultData,
      valuesToMatch: string[],
      filterName: string
    ): boolean => {
      return (valuesToMatch || []).some(
        (value) => (document as ContentfulDocumentData).assetType.code === value
      );
    },
    genericProductFilters: (
      document: DocumentResultData,
      filterName: string,
      valuesToMatch: string[]
    ): boolean => {
      const isPimDoc = isPIMDocument(document);
      if (isPimDoc) {
        const productFilterWithName = (document as PIMDocument).productFilters
          .filter(
            // TODO: Remove lower caseing as part of DXB-3449
            (productFilter) =>
              productFilter.filterCode.toLowerCase() ===
              filterName.toLowerCase()
          )
          .map((filter) => filter.code);

        if (productFilterWithName) {
          if (
            productFilterWithName.some((value) => valuesToMatch.includes(value))
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      //cater for other types of documents!!
      return false;
    }
  };
  const filtersWithValues = filters.filter(
    ({ value }) => value && value.length !== 0
  );
  //user clears ALL filters then return all documents
  if (filtersWithValues.length === 0) return documents;

  const result = documents.filter((document) => {
    return filtersWithValues.some((filter) => {
      const filterMatcherName = filter.name.trim().toLowerCase();
      // eslint-disable-next-line security/detect-object-injection
      const matcher = valueMatcher[filterMatcherName];
      if (matcher) {
        return matcher(document, filter.value || []);
      } else {
        const genericProductFilterMatcher =
          valueMatcher["genericProductFilters"];
        const result = genericProductFilterMatcher(document, filter.name, [
          ...(filter.value || [])
        ]);
        if (!result) {
          const genericMatcher = valueMatcher["genericCategory"];
          return genericMatcher(document, filter.name, [
            ...(filter.value || [])
          ]);
        } else {
          return result;
        }
      }
    });
  });
  return result;
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
