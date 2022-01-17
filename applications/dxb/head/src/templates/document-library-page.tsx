import React, { useMemo, useRef, useState } from "react";
import { graphql } from "gatsby";
import Accordion, { AccordionSummaryProps } from "@bmi/accordion";
import Checkbox, { Props as CheckboxProps } from "@bmi/checkbox";
import Hero from "@bmi/hero";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import AlertBanner from "@bmi/alert-banner";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import Filters from "@bmi/filters";
import PerfectScrollbar from "components/perfect-scrollbar/src";
import Typography from "@bmi/typography/src";
import Button from "@bmi/button/src";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { microCopy } from "../constants/microCopies";
import { Data as SiteData } from "../components/Site";
import { Data as PageInfoData } from "../components/PageInfo";
import Page, { Data as PageData } from "../components/Page";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import DocumentResults, {
  Data as DocumentResultsData,
  Format
} from "../components/DocumentResults";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../components/DocumentResultsFooter";
import { getCount as getSimpleTableCount } from "../components/DocumentSimpleTableResults";
import { getCount as getTechnicalTableCount } from "../components/DocumentTechnicalTableResults";
import { getCount as getCardsCount } from "../components/DocumentCardsResults";
import RichText, { RichTextData } from "../components/RichText";
import {
  filterDocuments,
  generateUniqueDocuments,
  getDocumentFilters,
  ResultType,
  Source
} from "../utils/filters";
import { devLog } from "../utils/devLog";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";
import filterStyles from "../components/styles/Filters.module.scss";
import withGTM from "../utils/google-tag-manager";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";

const PAGE_SIZE = 24;

const documentCountMap: Record<
  Format,
  (documents: DocumentResultsData) => number
> = {
  simpleTable: getSimpleTableCount,
  technicalTable: getTechnicalTableCount,
  cards: getCardsCount
};

type Data = PageInfoData &
  PageData & {
    description: RichTextData | null;
    allowFilterBy: string[] | null;
    source: Source;
    resultsType: ResultType;
    documents: DocumentResultsData;
    breadcrumbs: BreadcrumbsData;
    categoryCodes: string[];
    breadcrumbTitle: string;
  };

type Props = {
  pageContext: {
    pageId: string;
    siteId: string;
    categoryCode: string;
    pimClassificationCatalogueNamespace: string;
    variantCodeToPathMap: Record<string, string>;
  };
  data: {
    contentfulDocumentLibraryPage: Data;
    contentfulSite: SiteData;
  };
};

const resultTypeFormatMap: Record<
  Data["source"],
  Record<Data["resultsType"], Format>
> = {
  PIM: {
    Simple: "simpleTable",
    Technical: "technicalTable",
    "Card Collection": "simpleTable"
  },
  CMS: {
    Simple: "simpleTable",
    Technical: "simpleTable",
    "Card Collection": "cards"
  },
  ALL: {
    Simple: "simpleTable",
    Technical: "simpleTable",
    "Card Collection": "simpleTable"
  }
};

const GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT =
  +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100;

const sourceToSortMap: Record<
  Source,
  (documents: DocumentResultsData) => DocumentResultsData
> = {
  ALL: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a.assetType.name > b.assetType.name
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a.assetType.name < b.assetType.name
          ? -1
          : 0
      ),
  PIM: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a.assetType.code > b.assetType.code
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a.assetType.code < b.assetType.code
          ? -1
          : 0
      ),
  CMS: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a["brand"] > b["brand"]
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a["brand"] < b["brand"]
          ? -1
          : 0
      )
};
const DocumentLibraryPage = ({ pageContext, data }: Props) => {
  const {
    title,
    description,
    documents: unsortedDocuments,
    source,
    resultsType,
    breadcrumbs,
    breadcrumbTitle,
    seo,
    allowFilterBy
  } = data.contentfulDocumentLibraryPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    inputBanner: data.contentfulDocumentLibraryPage.inputBanner,
    seo,
    path: data.contentfulDocumentLibraryPage.path
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const GTMCheckbox = withGTM<CheckboxProps>(Checkbox, {
    label: "label"
  });
  const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

  // Largely duplicated from product-lister-page.tsx
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const initialDocuments = useMemo(
    () =>
      // eslint-disable-next-line security/detect-object-injection
      sourceToSortMap[source](
        generateUniqueDocuments(resultsType, unsortedDocuments)
      ),
    [unsortedDocuments]
  );
  // eslint-disable-next-line security/detect-object-injection
  const format: Format = resultTypeFormatMap[source][resultsType];
  // eslint-disable-next-line security/detect-object-injection
  const getCount = documentCountMap[format];
  const [pageCount, setPageCount] = useState(
    Math.ceil(getCount(initialDocuments) / PAGE_SIZE)
  );
  const [results, setResults] = useState(initialDocuments);
  const resultsElement = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState(
    getDocumentFilters(
      initialDocuments,
      source,
      resultsType,
      pageContext.pimClassificationCatalogueNamespace,
      allowFilterBy || []
    ).filter(Boolean)
  );

  const fakeSearch = async (documents, filters, page) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    setIsLoading(true);

    const newResults = filterDocuments(documents, filters);

    // eslint-disable-next-line security/detect-object-injection
    const getCount = documentCountMap[format];
    const newPageCount = Math.ceil(getCount(newResults) / PAGE_SIZE);
    setPageCount(newPageCount);
    setPage(newPageCount < page ? 0 : page);
    setResults(newResults);

    setIsLoading(false);
  };

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
  };

  // Largely similar to product-lister-page.tsx
  const handleFiltersChange =
    (resetDownloadList) => async (filterName, filterValue, checked) => {
      const addToArray = (array, value) => [...array, value];
      const removeFromArray = (array, value) =>
        array.filter((v) => v !== value);
      const getNewValue = (filter, checked, value) => {
        return checked
          ? addToArray(filter.value || [], filterValue)
          : removeFromArray(filter.value || [], filterValue);
      };

      const newFilters = filters.map((filter) => {
        return {
          ...filter,
          value:
            filter.name === filterName
              ? getNewValue(filter, checked, filterValue)
              : filter.value
        };
      });

      // NOTE: If filters change, we reset pagination to first page
      await fakeSearch(initialDocuments, newFilters, 1);

      resetDownloadList();
      setFilters(newFilters);
    };

  const clearFilters = () => {
    // TODO: util function to "reset filters object"?
    const newFilters = filters.map((filter) => ({
      ...filter,
      value: []
    }));

    fakeSearch(initialDocuments, newFilters, 1);

    setFilters(newFilters);
  };

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      {({ siteContext: { getMicroCopy } }) => (
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
              <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
            }
          />
          {description && (
            <Section backgroundColor="white">
              <RichText document={description} />
            </Section>
          )}
          <DownloadList maxSize={GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT * 1048576}>
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
                    <PerfectScrollbar className={filterStyles["scroll-bar"]}>
                      <div className={filterStyles["box"]}>
                        <Typography variant="h5">
                          {getMicroCopy(
                            microCopy.DOCUMENT_LIBRARY_FILTERS_TITLE
                          )}
                        </Typography>
                        <Button variant="text" onClick={clearFilters}>
                          {getMicroCopy(
                            microCopy.DOCUMENT_LIBRARY_FILTERS_CLEAR_ALL
                          )}
                        </Button>
                      </div>
                      <DownloadListContext.Consumer>
                        {({ resetList }) => (
                          <Filters
                            filters={filters}
                            onChange={handleFiltersChange(resetList)}
                            checkboxComponent={(props: CheckboxProps) => (
                              <GTMCheckbox
                                gtm={{
                                  id: "filter2",
                                  action: "Selector – Filter"
                                }}
                                {...props}
                              />
                            )}
                            accordionSummaryComponent={(
                              props: AccordionSummaryProps
                            ) => (
                              <GTMAccordionSummary
                                gtm={{
                                  id: "filter1",
                                  label: props.children?.props?.children,
                                  action: "Selector – Filter"
                                }}
                                {...props}
                              />
                            )}
                          />
                        )}
                      </DownloadListContext.Consumer>
                    </PerfectScrollbar>
                  </Grid>
                  <Grid item xs={12} md={12} lg={9}>
                    {results.length ? (
                      <>
                        <DocumentResults
                          data={results}
                          format={format}
                          page={page}
                        />
                        <div className={filterStyles["results"]}>
                          <DocumentResultsFooter
                            page={page}
                            count={pageCount}
                            onDownloadClick={
                              format === "cards" ||
                              (!matches && format === "technicalTable")
                                ? undefined
                                : handleDownloadClick
                            }
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </>
                    ) : (
                      getMicroCopy(microCopy.DOCUMENT_LIBRARY_NO_RESULTS)
                    )}
                  </Grid>
                </Grid>
              </div>
            </Section>
          </DownloadList>
          <Section backgroundColor="alabaster" isSlim>
            <Breadcrumbs data={enhancedBreadcrumbs} />
          </Section>
        </>
      )}
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
      documents {
        ...DocumentResultsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
