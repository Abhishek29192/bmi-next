import {
  AlertBanner,
  DownloadList,
  DownloadListContext,
  Filter,
  Grid,
  Hero,
  Section
} from "@bmi/components";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import queryString from "query-string";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import Page, { Data as PageData } from "../../components/Page";
import ProgressIndicator from "../../components/ProgressIndicator";
import RichText from "../../components/RichText";
import Scrim from "../../components/Scrim";
import { useSiteContext } from "../../components/Site";
import filterStyles from "../../components/styles/Filters.module.scss";
import { microCopy } from "../../constants/microCopies";
import { useConfig } from "../../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import { devLog } from "../../utils/devLog";
import {
  disableFiltersFromAggregations,
  queryElasticSearch
} from "../../utils/elasticSearch";
import { xferFilterValue } from "../../utils/elasticSearchPLP";
import {
  clearFilterValues,
  convertToURLFilters,
  updateFilterValue
} from "../../utils/filters";
import { Format } from "./components/DocumentResults";
import FilterSection from "./components/FilterSection";
import ResultSection from "./components/ResultSection";
import {
  compileESQuery,
  getURLFilters,
  resultTypeFormatMap
} from "./helpers/documentsLibraryHelpers";
import { DocumentLibraryProps, QueryParams } from "./types";

export const PAGE_SIZE = 24;

const DocumentLibraryPage = ({ pageContext, data }: DocumentLibraryProps) => {
  const location = useLocation();
  const { getMicroCopy } = useSiteContext();
  const [documents, setDocuments] = useState([]);
  // Largely duplicated from product-lister-page.tsx
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [pageCount, setPageCount] = useState(
    Math.ceil(documents.length / PAGE_SIZE)
  );

  const resultsElement = useRef<HTMLDivElement>(null);
  const {
    title,
    description,
    source,
    resultsType,
    assetTypes,
    breadcrumbs,
    breadcrumbTitle,
    seo,
    documentsFilters
  } = data.contentfulDocumentLibraryPage;
  const {
    config: { documentDownloadMaxLimit, isPreviewMode }
  } = useConfig();
  const maxSize = documentDownloadMaxLimit * 1048576;
  // eslint-disable-next-line security/detect-object-injection
  const format: Format = resultTypeFormatMap[source][resultsType];

  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock: data.contentfulDocumentLibraryPage.signupBlock,
    seo,
    path: data.contentfulDocumentLibraryPage.path
  };

  const fetchDocuments = async (filters, page, pageSize) => {
    if (isLoading && !initialLoading) {
      devLog("Already loading...");
      return;
    }

    if (isPreviewMode) {
      alert("You cannot search on the preview environment.");
      return;
    }

    setIsLoading(true);

    const query = compileESQuery(
      filters,
      page,
      pageSize,
      source,
      resultsType,
      assetTypes
    );
    const result = await queryElasticSearch(
      query,
      process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS
    );

    if (result && result.hits) {
      const { hits } = result;
      const uniqDocumentsCount =
        result.aggregations?.unique_documents_count.value || 0;
      const newPageCount = Math.ceil(uniqDocumentsCount / PAGE_SIZE);
      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      const docs = hits.hits.flatMap((hit) => {
        return resultsType === "Technical"
          ? hit.inner_hits.related_documents.hits.hits.map((hit) => hit._source)
          : [hit._source];
      });

      setDocuments(docs);
    }

    if (result && result.aggregations) {
      const newFilters = disableFiltersFromAggregations(
        filters,
        result.aggregations
      );

      setFilters(newFilters);
    }

    setIsLoading(false);
    setInitialLoading(false);

    return result;
  };

  const onFiltersChange = async (newFilters: Filter[]) => {
    const result = await fetchDocuments(newFilters, 0, PAGE_SIZE);

    if (result && result.aggregations) {
      setFilters(
        xferFilterValue(
          newFilters,
          disableFiltersFromAggregations(filters, result.aggregations)
        )
      );

      return;
    }

    setFilters(newFilters);
  };

  const handlePageChange = async (_, page) => {
    const scrollY = (resultsElement.current?.offsetTop || 200) - 200;
    window.scrollTo(0, scrollY);
    await fetchDocuments(filters, page - 1, PAGE_SIZE);
  };

  const handleFiltersChange = (filterName, filterValue, checked) => {
    const newFilters: Filter[] = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );

    const URLFilters = convertToURLFilters(newFilters);

    history.replaceState(
      null,
      null,
      `${location.pathname}?${queryString.stringify({
        filters: JSON.stringify(URLFilters)
      })}`
    );

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    history.replaceState(null, null, location.pathname);
    const newFilters = clearFilterValues(filters);
    onFiltersChange(newFilters);
  };

  const queryParams = useMemo<QueryParams>(() => {
    const parsedQueryParams = queryString.parse(location.search);
    return {
      ...parsedQueryParams,
      ...(parsedQueryParams.filters
        ? { filters: JSON.parse(parsedQueryParams.filters as string) }
        : { filters: [] })
    };
  }, [location]);

  useEffect(() => {
    if (documentsFilters.filters) {
      const { filters: initialFilters } = documentsFilters;
      if (queryParams?.filters?.length) {
        const updatedFilters = getURLFilters(initialFilters, queryParams);
        setFilters(updatedFilters);
        fetchDocuments(updatedFilters, 0, PAGE_SIZE);
      } else {
        setFilters(initialFilters);
        fetchDocuments(initialFilters, 0, PAGE_SIZE);
      }
    }
  }, [documentsFilters]);

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
    >
      <>
        {isLoading ? (
          <Scrim theme="light">
            <ProgressIndicator theme="light" />
          </Scrim>
        ) : null}
        <Hero
          level={2}
          title={title}
          breadcrumbs={
            <BackToResults isDarkThemed>
              <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
            </BackToResults>
          }
        />
        {description && (
          <Section backgroundColor="white">
            <RichText document={description} />
          </Section>
        )}
        <DownloadList maxSize={maxSize}>
          <DownloadListContext.Consumer>
            {({ count }) => {
              if (count === 0) {
                return null;
              }

              return (
                <AlertBanner severity="info">
                  <AlertBanner.Title>
                    {getMicroCopy(microCopy.DOWNLOAD_LIST_INFO_TITLE)}
                  </AlertBanner.Title>
                  {getMicroCopy(microCopy.DOWNLOAD_LIST_INFO_MESSAGE)}
                </AlertBanner>
              );
            }}
          </DownloadListContext.Consumer>
          <Section backgroundColor="white">
            <div className={filterStyles["Filters"]}>
              <Grid container spacing={3} ref={resultsElement}>
                <Grid item xs={12} md={12} lg={3}>
                  <FilterSection
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}
                    clearFilters={handleClearFilters}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={9}>
                  {!initialLoading ? (
                    <ResultSection
                      results={documents}
                      format={format}
                      page={page}
                      pageCount={pageCount}
                      handlePageChange={handlePageChange}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </div>
          </Section>
        </DownloadList>
        <Section backgroundColor="alabaster" isSlim>
          <Breadcrumbs data={enhancedBreadcrumbs} />
        </Section>
      </>
    </Page>
  );
};

export default DocumentLibraryPage;

export const pageQuery = graphql`
  query DocumentLibraryPageById($pageId: String!, $siteId: String!) {
    contentfulDocumentLibraryPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      ...PageFragment
      ...BreadcrumbsFragment
      description {
        ...RichTextFragment
      }
      source
      categoryCodes
      allowFilterBy
      resultsType
      assetTypes {
        pimCode
      }
      documentsFilters {
        filters {
          filterCode
          label
          name
          options {
            label
            value
          }
        }
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
