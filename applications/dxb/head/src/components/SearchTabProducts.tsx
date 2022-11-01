import { Filter, FilterProps, Grid } from "@bmi-digital/components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FiltersSidebar from "../components/FiltersSidebar";
import ProductsGridView from "../components/ProductsGridView";
import { devLog } from "../utils/devLog";
import {
  compileElasticSearchQuery,
  disableFiltersFromAggregations,
  getCountQuery,
  queryElasticSearch,
  removeIrrelevantFilters
} from "../utils/elasticSearch";
import {
  clearFilterValues,
  getUpdatedFilters,
  getURLFilterValues,
  setFiltersUrl,
  updateFilterValue
} from "../utils/filters";
import { enhanceColourFilterWithSwatches } from "../utils/filtersUI";
import ResultsPagination from "./ResultsPagination";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

type Props = {
  queryString: string;
  initialProducts?: ReadonlyArray<any>; // TODO
  onLoadingChange?: (isLoading: boolean) => void;
  onCountChange?: (count: number) => void;
  initialFilters: readonly Filter[];
  pageContext: any; // TODO
};

export const getCount = async (searchQuery: string): Promise<number> => {
  // See how much this function doesn't actually need this, RETHINK compile query
  const esQueryObject = compileElasticSearchQuery({
    allowFilterBy: [
      "ProductFamily",
      "ProductLine",
      "Brand",
      "appearanceAttributes$colourFamily",
      "generalInformation$materials",
      "appearanceAttributes$textureFamily",
      "Category"
    ],
    filters: [],
    groupByVariant: process.env.GATSBY_GROUP_BY_VARIANT === "true",
    page: 0,
    pageSize: 0,
    searchQuery
  });

  const countResult = await queryElasticSearch(
    getCountQuery(esQueryObject),
    ES_INDEX_NAME
  );

  if (countResult && countResult.hits) {
    return countResult.aggregations.unique_base_products_count.value;
  }

  return 0;
};

const SearchTabPanelProducts = (props: Props) => {
  const {
    queryString,
    pageContext,
    initialProducts = [],
    onLoadingChange,
    onCountChange,
    initialFilters
  } = props;

  // TODO: Not sure if we need this, would be nice to remove
  const isInitialLoad = useRef(true);
  const resultsElement = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState(initialProducts);

  // NOTE: map colour filter values to specific colour swatch representation
  const enhancedFilters: Filter[] = useMemo(() => {
    return initialFilters.map((filter) => {
      // TODO: Remove lower caseing as part of DXB-3449
      if (filter.name.toLowerCase().endsWith("colourfamily")) {
        return enhanceColourFilterWithSwatches(filter);
      }

      return filter;
    });
  }, [initialFilters]);
  const [filters, setFilters] = useState<Filter[]>(enhancedFilters);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  // =======================================
  // Loading status
  // =======================================

  const updateLoadingStatus = (isLoading: boolean) => {
    setIsLoading(isLoading);
    onLoadingChange && onLoadingChange(isLoading);
  };

  // =======================================
  // FETCH RESULTS
  // =======================================

  const queryES = async (
    filters: Filter[],
    page: number,
    pageSize: number,
    searchQuery?: string
  ) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    updateLoadingStatus(true);

    const esQueryObject = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes$colourFamily",
        "generalInformation$materials",
        "appearanceAttributes$textureFamily",
        "Category"
      ],
      filters,
      groupByVariant: process.env.GATSBY_GROUP_BY_VARIANT === "true",
      page,
      pageSize,
      searchQuery
    });

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(esQueryObject, ES_INDEX_NAME);

    if (results && results.hits && results.aggregations) {
      const newPageCount = Math.ceil(
        results.aggregations.unique_base_products_count.value / PAGE_SIZE
      );

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setProducts(
        results.hits.hits.map((hit) => ({
          ...hit._source,
          all_variants: hit.inner_hits.all_variants.hits.hits || []
        }))
      );
      onCountChange &&
        onCountChange(results.aggregations.unique_base_products_count.value);
    }

    updateLoadingStatus(false);

    return results;
  };

  // =======================================
  // FILTERS
  // =======================================

  const onFiltersChange = async (newFilters: Filter[]) => {
    let result = await queryES(newFilters, 0, PAGE_SIZE, queryString);

    if (result && result.aggregations) {
      if (isInitialLoad.current) {
        newFilters = removeIrrelevantFilters(newFilters, result.aggregations);
        isInitialLoad.current = false;

        newFilters = getUpdatedFilters(newFilters);
        if (getURLFilterValues().length > 0) {
          result = await queryES(newFilters, 0, PAGE_SIZE, queryString);
        }
      }

      newFilters = disableFiltersFromAggregations(
        newFilters,
        result.aggregations
      );
    }

    setFilters(newFilters);
    setFiltersUrl(newFilters);
  };

  const handleFiltersChange: FilterProps["onChange"] = (
    filterName,
    filterValue,
    checked
  ) => {
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
    queryES(filters, page - 1, PAGE_SIZE, queryString);
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
          <ProductsGridView
            isLoading={isLoading}
            products={products}
            pageContext={pageContext}
          />
        </Grid>
        <div style={{ marginTop: 48, marginBottom: 48 }}>
          <ResultsPagination
            page={page + 1}
            onPageChange={handlePageChange}
            count={pageCount}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default SearchTabPanelProducts;
