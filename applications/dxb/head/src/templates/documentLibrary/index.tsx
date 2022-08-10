import {
  AlertBanner,
  DownloadList,
  DownloadListContext,
  Grid,
  Hero,
  Section
} from "@bmi/components";
import { graphql } from "gatsby";
import React, { useRef, useState } from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../../components/Breadcrumbs";
import { getCount as getSimpleTableCount } from "../../components/DocumentSimpleTableResults";
import Page, { Data as PageData } from "../../components/Page";
import { Data as PageInfoData } from "../../components/PageInfo";
import ProgressIndicator from "../../components/ProgressIndicator";
import RichText, { RichTextData } from "../../components/RichText";
import Scrim from "../../components/Scrim";
import { Data as SiteData } from "../../components/Site";
import filterStyles from "../../components/styles/Filters.module.scss";
import { microCopy } from "../../constants/microCopies";
import { useConfig } from "../../contexts/ConfigProvider";
import { DocumentsWithFilters } from "../../types/documentsWithFilters";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import { devLog } from "../../utils/devLog";
import { filterDocuments, ResultType, Source } from "../../utils/filters";
import { getCount as getCardsCount } from "./components/DocumentCardsResults";
import { DocumentResultData, Format } from "./components/DocumentResults";
import { getCount as getTechnicalTableCount } from "./components/DocumentTechnicalTableResults";
import FilterSection from "./components/FilterSection";
import ResultSection from "./components/ResultSection";

const PAGE_SIZE = 24;

export type Data = PageInfoData &
  PageData & {
    description: RichTextData | null;
    allowFilterBy: string[] | null;
    source: Source;
    resultsType: ResultType;
    breadcrumbs: BreadcrumbsData;
    categoryCodes: string[];
    breadcrumbTitle: string;
    documentsWithFilters: DocumentsWithFilters;
  };

type Props = {
  pageContext: {
    pageId: string;
    siteId: string;
    categoryCode: string;
    variantCodeToPathMap?: Record<string, string>;
  };
  data: {
    contentfulDocumentLibraryPage: Data;
    contentfulSite: SiteData;
  };
};

const documentCountMap: Record<
  Format,
  (documents: DocumentResultData[]) => number
> = {
  simpleTable: getSimpleTableCount,
  technicalTable: getTechnicalTableCount,
  cards: getCardsCount
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

const DocumentLibraryPage = ({ pageContext, data }: Props) => {
  const {
    title,
    description,
    source,
    resultsType,
    breadcrumbs,
    breadcrumbTitle,
    seo,
    documentsWithFilters
  } = data.contentfulDocumentLibraryPage;
  const initialDocuments = documentsWithFilters.documents;
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

  const {
    config: { documentDownloadMaxLimit }
  } = useConfig();

  // Largely duplicated from product-lister-page.tsx
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line security/detect-object-injection
  const format: Format = resultTypeFormatMap[source][resultsType];
  // eslint-disable-next-line security/detect-object-injection
  const getCount = documentCountMap[format];
  const [pageCount, setPageCount] = useState(
    Math.ceil(getCount(initialDocuments) / PAGE_SIZE)
  );
  const [results, setResults] = useState(initialDocuments);
  const resultsElement = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState(documentsWithFilters.filters);

  const maxSize = documentDownloadMaxLimit * 1048576;

  const fakeSearch = async (documents, filters, page) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    setIsLoading(true);

    const newResults = await filterDocuments(documents, filters);
    // eslint-disable-next-line security/detect-object-injection
    const getCount = documentCountMap[format];
    const newPageCount = Math.ceil(getCount(newResults) / PAGE_SIZE);
    setPageCount(newPageCount);
    setPage(newPageCount < page ? 0 : page);
    setResults(newResults);

    setIsLoading(false);
  };

  const handlePageChange = (_, page) => {
    const scrollY = (resultsElement.current?.offsetTop || 200) - 200;
    window.scrollTo(0, scrollY);
    setPage(page);
  };

  // Largely similar to product-lister-page.tsx
  const handleFiltersChange =
    (resetDownloadList) => async (filterName, filterValue, checked) => {
      const addToArray = (array, value) => [...(array || []), value];
      const removeFromArray = (array, value) =>
        array.filter((v) => v !== value);
      const getNewValue = (filter, checked, value) => {
        return checked
          ? addToArray(filter.value, filterValue)
          : removeFromArray(filter.value, filterValue);
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
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
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
                      clearFilters={clearFilters}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={9}>
                    <ResultSection
                      results={results}
                      format={format}
                      page={page}
                      pageCount={pageCount}
                      handlePageChange={handlePageChange}
                    />
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
      documentsWithFilters {
        documents {
          ...DocumentResultsFragment
        }
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