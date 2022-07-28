import {
  DownloadList,
  DownloadListContext,
  Filter,
  Grid
} from "@bmi/components";
import React, { useEffect, useRef, useState } from "react";
import FiltersSidebar from "../components/FiltersSidebar";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import {
  Aggregations,
  disableFiltersFromAggregations,
  getCountQuery,
  getDocumentQueryObject,
  queryElasticSearch
} from "../utils/elasticSearch";
import {
  clearFilterValues,
  sortAlphabeticallyBy,
  updateFilterValue
} from "../utils/filters";
import DocumentResultsFooter from "./DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import { useSiteContext } from "./Site";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS;

// Creates filters from aggregations
// Requires contentful asset types for the localised labels
const getPagesFilters = (
  aggregations: Aggregations,
  allContentfulAssetType: ReadonlyArray<{ name: string; pimCode: string }>,
  getMicroCopy
): Filter[] => {
  const findLabel = (key) =>
    (allContentfulAssetType || []).find(({ pimCode }) => pimCode === key)?.name;

  return [
    {
      label: getMicroCopy(
        microCopy.SEARCH_FILTERS_DOCUMENTS_DOCUMENT_ASSET_TYPE
      ),
      filterCode: "assetTypes",
      name: "assetTypes",
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
  onCountChange?: (count: number) => void;
  extraData?: {
    allContentfulAssetType: ReadonlyArray<{ name: string; pimCode: string }>;
  };
};

export const getCount = async (queryString) => {
  const esQueryObject = getDocumentQueryObject(queryString, PAGE_SIZE);

  const countResult = await queryElasticSearch(
    getCountQuery(esQueryObject),
    ES_INDEX_NAME
  );

  return countResult?.aggregations?.total?.value;
};

const SearchTabPanelDocuments = (props: Props) => {
  const { queryString, onLoadingChange, onCountChange, extraData } = props;

  const { getMicroCopy } = useSiteContext();

  const {
    config: { documentDownloadMaxLimit }
  } = useConfig();

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

    const esQueryObject = getDocumentQueryObject(
      queryString,
      pageSize,
      page,
      filters
    );

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(esQueryObject, ES_INDEX_NAME);

    if (results && results.hits) {
      const { hits, aggregations } = results;
      const newPageCount = Math.ceil(aggregations.total.value / PAGE_SIZE);

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setResults(hits.hits.map((hit) => hit._source));

      onCountChange && onCountChange(aggregations.total.value);
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

  const handleFiltersChange =
    (resetDownloadList) => (filterName, filterValue, checked) => {
      const newFilters = updateFilterValue(
        filters,
        filterName,
        filterValue,
        checked
      );

      resetDownloadList();
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

  const maxSize = documentDownloadMaxLimit * 1048576;

  return (
    <DownloadList maxSize={maxSize}>
      <Grid container spacing={3} ref={resultsElement}>
        <Grid item xs={12} md={12} lg={3}>
          <DownloadListContext.Consumer>
            {({ resetList }) => (
              <FiltersSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange(resetList)}
                onClearFilters={clearFilters}
              />
            )}
          </DownloadListContext.Consumer>
        </Grid>
        <Grid item xs={12} md={12} lg={9} style={{ paddingTop: 0 }}>
          <DocumentSimpleTableResults
            documents={results}
            page={1}
            documentsPerPage={PAGE_SIZE}
          />
          <div>
            <DocumentResultsFooter
              page={page + 1}
              count={pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        </Grid>
      </Grid>
    </DownloadList>
  );
};

export default SearchTabPanelDocuments;
