import { Filter } from "@bmi-digital/components";
import { ResultType, Source } from "../../../utils/filters";
import { removePLPFilterPrefix } from "../../../utils/product-filters";
import { Format } from "../components/DocumentResults";
import { PAGE_SIZE } from "../index";
import {
  AssetType,
  ContentfulDocumentLibraryPage,
  DocumentType
} from "../types";

// TODO: The search and product lister pages use quite similar components/functions and logic to query documents and filter those from ES.
// I believe we should refactor those components/functions to avoide code duplication and complexity.
// Test coverage should be provided after refactoring

export const filterKey = (currentFilter: Filter) =>
  currentFilter.filterCode === "assetType" ||
  currentFilter.filterCode === "AssetType"
    ? "assetType"
    : currentFilter.filterCode.toUpperCase();

export const generateFiltersAggs = (filters: Filter[] = []) => {
  return filters.reduce((acc, currentFilter: Filter) => {
    const key = filterKey(currentFilter);
    const agg = {
      [key]: {
        terms: {
          size: "300",
          field: `${key}.code.keyword`
        }
      }
    };
    return {
      ...acc,
      ...agg
    };
  }, {});
};

export const generateUserSelectedFilterTerms = (updatedFilters: Filter[]) => {
  return (updatedFilters || [])
    .filter((filter) => (filter.value || []).length > 0)
    .reduce((acc, currFilter) => {
      const termsQuery = (filter, value) => ({
        terms: {
          [`${filterKey(filter)}.code.keyword`]: value
        }
      });
      const query = termsQuery(currFilter, currFilter.value);
      return [...acc, query];
    }, []);
};

export const resultTypeFormatMap: Record<
  ContentfulDocumentLibraryPage["source"],
  Record<ContentfulDocumentLibraryPage["resultsType"], Format>
> = {
  PIM: {
    Simple: "simpleTable",
    "Simple Archive": "simpleArchiveTable",
    Technical: "technicalTable",
    "Card Collection": "simpleTable"
  },
  CMS: {
    Simple: "simpleTable",
    "Simple Archive": null,
    Technical: "simpleTable",
    "Card Collection": "cards"
  },
  ALL: {
    Simple: "simpleTable",
    "Simple Archive": "simpleArchiveTable",
    Technical: "simpleTable",
    "Card Collection": "simpleTable"
  }
};

export const sourceMapToDocumentType: Record<
  ContentfulDocumentLibraryPage["source"],
  DocumentType[] | undefined
> = {
  PIM: ["PIMDocument"],
  CMS: ["ContentfulDocument"],
  ALL: undefined
};

const getDocumentTypes = (
  resultType: ResultType,
  source: Source
): DocumentType[] => {
  switch (resultType) {
    case "Simple":
      // eslint-disable-next-line security/detect-object-injection
      return sourceMapToDocumentType[source];
      break;
    case "Simple Archive":
      return ["PIMSystemDocument", "PIMDocument"];
      break;
    case "Technical":
      return ["PIMDocument"];
      break;
    default:
      return ["ContentfulDocument"];
  }
};

export const compileESQuery = (
  filters: Filter[],
  page: number,
  source: Source,
  resultType: ResultType,
  assetTypes: AssetType[]
) => {
  const userSelectedFilterTerms = generateUserSelectedFilterTerms(filters);
  const documentTypes: DocumentType[] = getDocumentTypes(resultType, source);
  const assetTypeCodes = (assetTypes || [])
    .filter((item) => item.code)
    .map((item) => item.code);
  return {
    size: PAGE_SIZE,
    from: page * PAGE_SIZE,
    sort: [{ "title.keyword": "asc" }],
    aggs: {
      ...generateFiltersAggs(filters),
      unique_documents_count: {
        cardinality: {
          field: "titleAndSize.keyword"
        }
      }
    },
    query: {
      bool: {
        must: [
          documentTypes && {
            terms: {
              "__typename.keyword": documentTypes
            }
          },
          resultType === "Simple Archive" && {
            match: { "approvalStatus.keyword": "discontinued" }
          },
          assetTypeCodes.length && {
            terms: {
              "assetType.code.keyword": [...assetTypeCodes]
            }
          },
          ...userSelectedFilterTerms
        ].filter(Boolean)
      }
    },
    collapse:
      resultType === "Technical"
        ? {
            field: "productBaseCode.keyword",
            inner_hits: {
              name: "related_documents",
              size: 100 //trial solution
            }
          }
        : {
            field: "titleAndSize.keyword"
          }
  };
};

export const getURLFilters = (initialFilters, queryParams) => {
  const updatedFilters = initialFilters.map((filter) => {
    const currentQueryFilterValue = queryParams.filters.find(
      // TODO: https://bmigroup.atlassian.net/browse/DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
      ({ name }) =>
        name.toUpperCase() === removePLPFilterPrefix(filter.name).toUpperCase()
    )?.value;

    return {
      ...filter,
      value: [].concat(currentQueryFilterValue).filter(Boolean)
    };
  });

  return updatedFilters;
};
