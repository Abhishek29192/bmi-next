import React, { useState, useEffect, useRef } from "react";
import Grid from "@bmi/grid";
import Pagination from "@bmi/pagination";
import FiltersSidebar from "../components/FiltersSidebar";
import ProductsGridView from "../components/ProductsGridView";
import { clearFilterValues, updateFilterValue } from "../utils/filters";
import {
  queryElasticSearch,
  compileElasticSearchQuery,
  disableFiltersFromAggregations,
  removeIrrelevantFilters,
  getCountQuery
} from "../utils/elasticSearch";
import { devLog } from "../utils/devLog";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

type Props = {
  queryString: string;
  initialProducts?: ReadonlyArray<any>; // TODO
  onLoadingChange?: (isLoading: boolean) => void;
  initialFilters: any; // TODO
  pageContext: any; // TODO
};

export const getCount = async (searchQuery) => {
  // See how much this function doesn't actually need this, RETHINK compile query
  let esQueryObject = compileElasticSearchQuery([], null, 0, 0, searchQuery);

  const countResult = await queryElasticSearch(
    getCountQuery(esQueryObject),
    ES_INDEX_NAME
  );

  if (countResult && countResult.hits) {
    return countResult.hits.total.value;
  }

  return 0;
};

const SearchTabPanelProducts = (props: Props) => {
  const {
    queryString,
    pageContext,
    initialProducts = [],
    onLoadingChange,
    initialFilters
  } = props;

  // TODO: Not sure if we need this, would be nice to remove
  const isInitialLoad = useRef(true);
  const resultsElement = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
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

    let esQueryObject = compileElasticSearchQuery(
      filters,
      categoryCode,
      page,
      pageSize,
      searchQuery
    );

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(esQueryObject, ES_INDEX_NAME);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setProducts(hits.hits.map((hit) => hit._source));
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
      newFilters = disableFiltersFromAggregations(
        newFilters,
        result.aggregations
      );

      if (isInitialLoad.current) {
        newFilters = removeIrrelevantFilters(newFilters, result.aggregations);
        isInitialLoad.current = false;
      }
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
      <Grid item xs={12} md={12} lg={9} style={{ paddingTop: 60 }}>
        <Grid container spacing={3}>
          <ProductsGridView products={products} pageContext={pageContext} />
        </Grid>
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

export default SearchTabPanelProducts;
