import {
  DownloadList,
  DownloadListContext,
  Filter,
  Grid,
  Hero,
  Section
} from "@bmi-digital/components";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import queryString from "query-string";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { microCopy } from "@bmi/microcopies";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import DocumentResultsFooter from "../../components/DocumentResultsFooter";
import Page, { Data as PageData } from "../../components/Page";
import ProgressIndicator from "../../components/ProgressIndicator";
import RichText from "../../components/RichText";
import Scrim from "../../components/Scrim";
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
  replaceDotFiltersParameter,
  updateFilterValue
} from "../../utils/filters";
import FilterSection from "../../components/FiltersSidebar";
import { generateGetMicroCopy } from "../../components/MicroCopy";
import { ResultsSection, classes } from "./DocumentLibraryStyles";
import { Format } from "./components/DocumentResults";
import { DownloadListAlertBanner } from "./components/DownloadListAlertBanner";
import ResultSection from "./components/ResultSection";
import {
  compileESQuery,
  getURLFilters,
  resultTypeFormatMap
} from "./helpers/documentsLibraryHelpers";
import { DocumentLibraryProps, QueryParams } from "./types";

export const PAGE_SIZE = 25;

const DocumentLibraryPage = ({ pageContext, data }: DocumentLibraryProps) => {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [mobileShowAllDocuments, setMobileShowAllDocuments] = useState(0);
  // Largely duplicated from product-lister-page.tsx
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [pageCount, setPageCount] = useState(
    Math.ceil(documents.length / PAGE_SIZE)
  );
  const getMicroCopy = generateGetMicroCopy(
    data.contentfulSite.resources?.microCopy
  );

  const resultsElement = useRef<HTMLDivElement>(null);
  const {
    title,
    description,
    source,
    resultsType,
    contentfulAssetTypes,
    breadcrumbs,
    breadcrumbTitle,
    seo,
    documentsFilters
  } = data.contentfulDocumentLibraryPage;
  const { documentDownloadMaxLimit, isPreviewMode } = useConfig();
  const maxSize = (documentDownloadMaxLimit || 0) * 1000000;
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

  const fetchDocuments = async (filters: Filter[], page: number) => {
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
      source,
      resultsType,
      contentfulAssetTypes
    );
    const result = await queryElasticSearch(
      query,
      process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS
    );

    if (result && result.hits) {
      const { hits } = result;
      const uniqDocumentsCount =
        result.aggregations?.unique_documents_count.value || 0;
      setMobileShowAllDocuments(uniqDocumentsCount);
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
    const result = await fetchDocuments(newFilters, 0);

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

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const scrollY = (resultsElement.current?.offsetTop || 200) - 200;
    window.scrollTo(0, scrollY);
    // TODO: DXB-4320 Don't query ES if we already have the documents for that page
    await fetchDocuments(filters, page - 1);
  };

  const handleFiltersChange = (
    filterName: string,
    filterValue: string,
    checked: boolean
  ) => {
    const newFilters: Filter[] = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );

    const URLFilters = convertToURLFilters(newFilters);

    history.replaceState(
      null,
      "",
      `${location.pathname}?${queryString.stringify({
        filters: JSON.stringify(URLFilters)
      })}`
    );

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    history.replaceState(null, "", location.pathname);
    const newFilters = clearFilterValues(filters);
    onFiltersChange(newFilters);
  };

  const queryParams = useMemo<QueryParams>(() => {
    const parsedQueryParams = queryString.parse(location.search);
    return {
      ...parsedQueryParams,
      ...(parsedQueryParams.filters
        ? {
            filters: JSON.parse(
              replaceDotFiltersParameter(parsedQueryParams.filters as string)
            )
          }
        : { filters: [] })
    };
  }, [location]);

  useEffect(() => {
    if (
      //Should not fetch products if resultsType === "Simple Archive" && source === "CMS"
      resultsType === "Simple Archive" &&
      source === "CMS"
    ) {
      setInitialLoading(false);
      setIsLoading(false);
      return;
    }

    if (documentsFilters?.filters) {
      const { filters: initialFilters } = documentsFilters;
      if (queryParams?.filters?.length) {
        const updatedFilters = getURLFilters(initialFilters, queryParams);
        setFilters(updatedFilters);
        fetchDocuments(updatedFilters, 0);
      } else {
        setFilters(initialFilters);
        fetchDocuments(initialFilters, 0);
      }
    }
  }, [documentsFilters, resultsType, source]);

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
    >
      {isLoading ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Hero
        level={2}
        title={title}
        breadcrumbs={
          <BackToResults isDarkThemed data-testid="breadcrumbs-section-top">
            <Breadcrumbs
              data={enhancedBreadcrumbs}
              isDarkThemed
              data-testid="document-library-page-breadcrumbs-top"
            />
          </BackToResults>
        }
      />
      {description && (
        <Section
          backgroundColor="white"
          data-testid={`document-library-description-section`}
        >
          <RichText document={description} hasNoBottomMargin />
        </Section>
      )}
      <DownloadList maxSize={maxSize}>
        <DownloadListContext.Consumer>
          {({ count }) => {
            if (count === 0) {
              return null;
            }

            return <DownloadListAlertBanner />;
          }}
        </DownloadListContext.Consumer>
        {!(resultsType === "Simple Archive" && source === "CMS") && (
          <ResultsSection
            backgroundColor="white"
            className={classes["resultsSection"]}
            id={`document-library-filters`}
          >
            <Grid container spacing={3} ref={resultsElement}>
              <Grid xs={12} md={12} lg={3}>
                <FilterSection
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  numberOfResults={
                    resultsType !== "Technical" ? mobileShowAllDocuments : 0
                  }
                  filtersTitle={getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_FILTERS_TITLE
                  )}
                  clearAllBtnLabel={getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_FILTERS_CLEAR_ALL
                  )}
                />
              </Grid>
              <Grid xs={12} md={12} lg={9}>
                {!initialLoading ? (
                  <ResultSection
                    results={documents}
                    assetTypes={contentfulAssetTypes}
                    format={format}
                    pageNumber={page}
                  />
                ) : null}
              </Grid>
            </Grid>
            {!initialLoading && (
              <DocumentResultsFooter
                sticky={format !== "cards"}
                onPageChange={handlePageChange}
                page={page + 1}
                count={pageCount}
                format={format}
                isDownloadButton={format !== "cards"}
              />
            )}
          </ResultsSection>
        )}
      </DownloadList>
      <Section
        backgroundColor="alabaster"
        isSlim
        data-testid="breadcrumbs-section-bottom"
      >
        <Breadcrumbs
          data={enhancedBreadcrumbs}
          data-testid="document-library-page-breadcrumbs-bottom"
        />
      </Section>
    </Page>
  );
};

export default DocumentLibraryPage;

export const pageQuery = graphql`
  query DocumentLibraryPageById($pageId: String!, $siteId: String!) {
    contentfulDocumentLibraryPage(id: { eq: $pageId }) {
      ...PageInfoHeroFragment
      ...PageFragment
      ...BreadcrumbsFragment
      description {
        ...RichTextFragment
      }
      source
      categoryCodes
      allowFilterBy
      resultsType
      contentfulAssetTypes {
        name
        code
        description {
          ...RichTextFragment
        }
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
