import React, { useState, useEffect, useRef } from "react";
import Grid from "@bmi/grid";
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
import PageSummaryCard from "./PageSummaryCard";
import { useSiteContext } from "./Site";
import ResultsPagination from "./ResultsPagination";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PAGES;

// Creates filters from aggregations
// It works here because the tags on pages effectively only have
// one field, "title", which is both the key and the label
const getPagesFilters = (aggregations: any, getMicroCopy) => {
  // TODO: At the moment the tags seem to only be "group" tags
  return [
    {
      label: getMicroCopy("search.filters.pages.page-type-tag"),
      name: "page-type-tag",
      value: [],
      options: aggregations.tags.buckets
        .sort(sortAlphabeticallyBy("key"))
        .map(({ key }) => ({
          label: key,
          value: key
        }))
    }
  ].filter(({ options }) => options.length);
};

type Props = {
  queryString: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onCountChange?: (count: number) => void;
  pageContext: any; // TODO
};

const getQueryObject = (queryString, page = 0, filters = []) => {
  // Filters in the query
  // TODO: this acts like it handles many filters but actually handles one. refactor
  const filtersQuery = filters
    .filter(({ value }) => value.length)
    .map((filter) => {
      const termQuery = (value) => ({
        term: {
          ["tags.title.keyword"]: value
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
      query_string: {
        query: `*${queryString}*`,
        type: "cross_fields",
        fields: ["pageData"]
      }
    },
    ...filtersQuery
  ];

  return {
    size: PAGE_SIZE,
    from: page * PAGE_SIZE,
    _source: {
      excludes: ["pageData"]
    },
    aggs: {
      tags: {
        terms: {
          size: "100",
          field: "tags.title.keyword"
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

const SearchTabPanelPages = (props: Props) => {
  const { queryString, pageContext, onLoadingChange, onCountChange } = props;

  const { getMicroCopy } = useSiteContext();

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

      onCountChange && onCountChange(hits.total.value);
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
        newFilters = getPagesFilters(result.aggregations, getMicroCopy);
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

  const showSidebar = filters.length > 0;

  return (
    <Grid container spacing={3} ref={resultsElement}>
      {showSidebar ? (
        <Grid item xs={12} md={12} lg={3}>
          <FiltersSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
          />
        </Grid>
      ) : null}
      <Grid
        item
        xs={12}
        md={12}
        lg={showSidebar ? 9 : 12}
        style={{ paddingTop: 0 }}
      >
        {results
          .filter(({ path }) => path)
          .map((result, index) => (
            <PageSummaryCard
              key={index}
              title={result.title}
              subtitle={result.subtitle}
              path={result.path}
              countryCode={pageContext.countryCode}
            />
          ))}
        <ResultsPagination
          page={page + 1}
          onPageChange={handlePageChange}
          count={pageCount}
        />
      </Grid>
    </Grid>
  );
};

export default SearchTabPanelPages;
