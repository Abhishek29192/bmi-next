import React, { useState, useEffect, useRef, useContext } from "react";
import Grid from "@bmi/grid";
import Pagination from "@bmi/pagination";
import FiltersSidebar from "../components/FiltersSidebar";
import {
  clearFilterValues,
  sortAlphabeticallyBy,
  updateFilterValue
} from "../utils/filters";
import {
  queryElasticSearch,
  disableFiltersFromAggregations,
  getCountQuery
} from "../utils/elasticSearch";
import { devLog } from "../utils/devLog";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import { SiteContext } from "./Site";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS;

// Creates filters from aggregations
// Requires contentful asset types for the localised labels
const getPagesFilters = (
  aggregations: any,
  allContentfulAssetType: ReadonlyArray<{ name: string; pimCode: string }>,
  getMicroCopy
) => {
  const findLabel = (key) =>
    (allContentfulAssetType || []).find(({ pimCode }) => pimCode === key)?.name;

  return [
    {
      label: getMicroCopy("search.filters.documents.document-asset-type"),
      name: "document-asset-type",
      value: [],
      options: aggregations.assetTypes.buckets
        .sort(sortAlphabeticallyBy("key"))
        .map(({ key }) => ({
          label: findLabel(key) || key,
          value: key
        }))
    }
  ];
};

type Props = {
  queryString: string;
  onLoadingChange?: (isLoading: boolean) => void;
  extraData?: {
    allContentfulAssetType: ReadonlyArray<{ name: string; pimCode: string }>;
  };
};

const getQueryObject = (queryString, page = 0, filters = []) => {
  // Filters in the query
  // TODO: this acts like it handles many filters but actually handles one. refactor
  const filtersQuery = filters
    .filter(({ value }) => value.length)
    .map((filter) => {
      const termQuery = (value) => ({
        term: {
          ["assetType.pimCode.keyword"]: value
        }
      });
      const query =
        filter.value.length === 1
          ? termQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(termQuery)
              }
            };

      return query;
    });

  const queryElements = [
    {
      match: {
        title: {
          query: queryString
        }
      }
    },
    ...filtersQuery
  ];

  return {
    size: PAGE_SIZE,
    from: page * PAGE_SIZE,
    aggs: {
      assetTypes: {
        terms: {
          size: "100",
          field: "assetType.pimCode.keyword"
        }
      }
    },
    query:
      queryElements.length === 1
        ? queryElements[0]
        : {
            bool: {
              must: queryElements
            }
          }
  };
};

export const getCount = async (queryString) => {
  const esQueryObject = getQueryObject(queryString);

  const countResult = await queryElasticSearch(
    getCountQuery(esQueryObject),
    ES_INDEX_NAME
  );

  return countResult?.hits?.total?.value;
};

const SearchTabPanelDocuments = (props: Props) => {
  const { queryString, onLoadingChange, extraData } = props;

  const { getMicroCopy } = useContext(SiteContext);

  // TODO: Not sure if we need this, would be nice to remove
  const isInitialLoad = useRef(true);
  const resultsElement = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(results.length / PAGE_SIZE)
  );

  // =======================================
  // Loading status
  // =======================================

  const updateLoadingStatus = (isLoading) => {
    setIsLoading(isLoading);
    onLoadingChange && onLoadingChange(isLoading);
  };

  // =======================================
  // FETCH RESULTS
  // =======================================

  const queryES = async (
    filters,
    categoryCode,
    page,
    pageSize,
    searchQuery?: string
  ) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    updateLoadingStatus(true);

    const esQueryObject = getQueryObject(queryString, page, filters);

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(esQueryObject, ES_INDEX_NAME);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setResults(hits.hits.map((hit) => hit._source));
    }

    updateLoadingStatus(false);

    return results;
  };

  // =======================================
  // FILTERS
  // =======================================

  const onFiltersChange = async (newFilters) => {
    const result = await queryES(newFilters, null, 0, PAGE_SIZE, queryString);

    if (result && result.aggregations) {
      // On first request we need to evaluate the results to get the filters
      if (isInitialLoad.current) {
        newFilters = getPagesFilters(
          result.aggregations,
          extraData?.allContentfulAssetType,
          getMicroCopy
        );

        isInitialLoad.current = false;
      }

      newFilters = disableFiltersFromAggregations(
        newFilters,
        result.aggregations
      );
    }

    setFilters(newFilters);
  };

  const handleFiltersChange = (filterName, filterValue, checked) => {
    const newFilters = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );

    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = clearFilterValues(filters);

    onFiltersChange(newFilters);
  };

  // =======================================
  // PAGINATION
  // =======================================

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    queryES(filters, null, page - 1, PAGE_SIZE, queryString);
  };

  // =======================================
  // INITIALISATION
  // =======================================

  useEffect(() => {
    // Clearing filters has the effect of refetching data
    clearFilters();
  }, []);

  return (
    <Grid container spacing={3} ref={resultsElement}>
      <Grid item xs={12} md={12} lg={3}>
        <FiltersSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={9} style={{ paddingTop: 0 }}>
        <DocumentSimpleTableResults
          documents={results}
          page={1}
          documentsPerPage={PAGE_SIZE}
        />
        <Grid container style={{ marginTop: 48, marginBottom: 48 }}>
          <Grid item xs={12} md={6} lg={6}></Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Pagination
              page={page + 1}
              onChange={handlePageChange}
              count={pageCount}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchTabPanelDocuments;
