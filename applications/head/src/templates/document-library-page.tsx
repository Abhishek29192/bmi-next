import React, { useState } from "react";
import { graphql } from "gatsby";
import Hero from "@bmi/hero";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import { Data as SiteData } from "../components/Site";
import { Data as PageInfoData } from "../components/PageInfo";
import Page, { Data as PageData } from "../components/Page";
import Breadcrumbs from "../components/Breadcrumbs";
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
import { Document } from "@contentful/rich-text-types";
import { SiteContext } from "../components/Site";
import AlertBanner from "@bmi/alert-banner";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import RichText from "../components/RichText";
import {
  getBrandFilterFromDocuments,
  getProductFamilyFilterFromDocuments,
  getTextureFilterFromDocuments,
  getAssetTypeFilterFromDocuments,
  findPIMDocumentBrandCategory,
  isPIMDocument
} from "../utils/filters";
import Filters from "@bmi/filters";
import { devLog } from "../utils/devLog";
import PerfectScrollbar from "components/perfect-scrollbar/src";
import Typography from "@bmi/typography/src";
import Button from "@bmi/button/src";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";

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
    description: { json: Document } | null;
    source: "PIM" | "CMS" | "ALL";
    resultsType: "Simple" | "Technical" | "Card Collection";
    documents: DocumentResultsData;
  };

type Props = {
  pageContext: {
    pageId: string;
    siteId: string;
    categoryCode: string;
    pimClassificationCatalogueNamespace: string;
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

const MAX_DOWNLOAD_LIMIT = 10 * 1048576;

const DocumentLibraryPage = ({ pageContext, data }: Props) => {
  const {
    title,
    description,
    documents: initialDocuments,
    source,
    resultsType
  } = data.contentfulDocumentLibraryPage;

  const pageData: PageData = {
    slug: data.contentfulDocumentLibraryPage.slug,
    inputBanner: data.contentfulDocumentLibraryPage.inputBanner
  };

  const breadcrumbs = (
    <Breadcrumbs
      title={title}
      slug={data.contentfulDocumentLibraryPage.slug}
      menuNavigation={data.contentfulSite.menuNavigation}
      isDarkThemed
    />
  );

  const getFilters = (
    documents: DocumentResultsData,
    source: Data["source"],
    resultsType: Data["resultsType"],
    classificationNamespace
  ) => {
    // AC1 – view a page that displays PIM documents in a Simple Document table - INVALID

    if (source === "PIM" && resultsType === "Simple") {
      return [
        getBrandFilterFromDocuments(documents),
        getProductFamilyFilterFromDocuments(documents),
        getTextureFilterFromDocuments(classificationNamespace, documents)
      ];
    }

    // AC2 – view a page that displays documents in a Technical Document table
    if (source === "PIM" && resultsType === "Technical") {
      return [
        getBrandFilterFromDocuments(documents),
        getProductFamilyFilterFromDocuments(documents)
      ];
    }

    // AC3 – view a page that displays documents in a Card Collection
    if (source === "CMS" && resultsType === "Card Collection") {
      return [getBrandFilterFromDocuments(documents)];
    }

    // AC4 – view a page that displays All documents in a Simple Document table
    if (source === "ALL" && resultsType === "Simple") {
      return [
        getAssetTypeFilterFromDocuments(documents),
        getBrandFilterFromDocuments(documents),
        getProductFamilyFilterFromDocuments(documents)
      ];
    }

    // AC5 – view a page that displays CMS documents in a Simple Document table,
    // more than one Asset Type
    // AC6 – view a page that displays CMS documents in a Simple Document table,
    // only one Asset Type
    if (source === "CMS" && resultsType === "Simple") {
      return [
        getBrandFilterFromDocuments(documents),
        // TODO: Should not be there if ONLY ONE OPTION AVAILABLE
        // TODO: Move this responsibility to Filters???
        getAssetTypeFilterFromDocuments(documents)
      ];
    }

    return [];
  };

  // Largely duplicated from product-lister-page.tsx
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(
    Math.ceil(initialDocuments.length / PAGE_SIZE)
  );
  const [results, setResults] = useState(initialDocuments);

  const [filters, setFilters] = useState(
    getFilters(
      initialDocuments,
      source,
      resultsType,
      pageContext.pimClassificationCatalogueNamespace
    ).filter(Boolean)
  );

  const format = resultTypeFormatMap[source][resultsType];

  const filterDocuments = (
    documents: DocumentResultsData,
    filters
  ): DocumentResultsData => {
    const valueGetters = {
      brand: (document) =>
        isPIMDocument(document)
          ? findPIMDocumentBrandCategory(document)?.code
          : document.brand,
      // TODO: here we find first vs filter all inside getProductFamilyFilter
      productFamily: (document) =>
        isPIMDocument(document) &&
        (document.product.categories || []).find(
          ({ categoryType }) => categoryType === "ProductFamily"
        )?.code,
      contentfulAssetType: (document) => document.assetType.code
    };

    const filtersWithValues = filters.filter(({ value }) => value.length !== 0);

    return documents.filter((document) => {
      const matched = [];

      filters.forEach((filter) => {
        const valueGetter = valueGetters[filter.name];

        if (valueGetter && filter.value.includes(valueGetter(document))) {
          matched.push(filter.name);
        }
      });

      return matched.length === filtersWithValues.length;
    });
  };

  const fakeSearch = async (documents, filters, page) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    setIsLoading(true);

    const newResults = filterDocuments(documents, filters);

    const getCount = documentCountMap[format];
    const newPageCount = Math.ceil(getCount(newResults) / PAGE_SIZE);
    setPageCount(newPageCount);
    setPage(newPageCount < page ? 0 : page);
    setResults(newResults);

    setIsLoading(false);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (_, page) => {
    window.scrollTo(0, 0);
    setPage(page);
  };

  // Largely similar to product-lister-page.tsx
  const handleFiltersChange = (resetDownloadList) => async (
    filterName,
    filterValue,
    checked
  ) => {
    const addToArray = (array, value) => [...array, value];
    const removeFromArray = (array, value) => array.filter((v) => v !== value);
    const getNewValue = (filter, checked, value) => {
      return checked
        ? addToArray(filter.value || [], filterValue)
        : removeFromArray(filter.value || [], filterValue);
    };

    let newFilters = filters.map((filter) => {
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
    let newFilters = filters.map((filter) => ({
      ...filter,
      value: []
    }));

    fakeSearch(initialDocuments, newFilters, 1);

    setFilters(newFilters);
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      {isLoading ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Hero level={2} title={title} breadcrumbs={breadcrumbs} />
      {description && (
        <Section backgroundColor="white">
          <RichText document={description.json} />
        </Section>
      )}
      <SiteContext.Consumer>
        {({ getMicroCopy }) => {
          return (
            <DownloadList maxSize={MAX_DOWNLOAD_LIMIT}>
              <DownloadListContext.Consumer>
                {({ count }) => {
                  if (count === 0) {
                    return null;
                  }

                  return (
                    <AlertBanner severity="info">
                      <AlertBanner.Title>
                        {getMicroCopy("downloadList.info.title")}
                      </AlertBanner.Title>
                      {getMicroCopy("downloadList.info.message")}
                    </AlertBanner>
                  );
                }}
              </DownloadListContext.Consumer>
              <Section backgroundColor="white">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={3}>
                    <PerfectScrollbar
                      style={{
                        position: "sticky",
                        top: "180px",
                        maxHeight: "calc(100vh - 200px)",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4
                        }}
                      >
                        <Typography variant="h5">Filters</Typography>
                        <Button variant="text" onClick={clearFilters}>
                          Clear All
                        </Button>
                      </div>
                      <DownloadListContext.Consumer>
                        {({ resetList }) => (
                          <Filters
                            filters={filters}
                            onChange={handleFiltersChange(resetList)}
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
                        <DocumentResultsFooter
                          page={page}
                          count={pageCount}
                          onDownloadClick={
                            format === "cards" ? undefined : handleDownloadClick
                          }
                          onPageChange={handlePageChange}
                        />
                      </>
                    ) : (
                      getMicroCopy("documentLibrary.noResults")
                    )}
                  </Grid>
                </Grid>
              </Section>
            </DownloadList>
          );
        }}
      </SiteContext.Consumer>
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs
          title={title}
          slug={data.contentfulDocumentLibraryPage.slug}
          menuNavigation={data.contentfulSite.menuNavigation}
        />
      </Section>
    </Page>
  );
};

export default DocumentLibraryPage;

export const pageQuery = graphql`
  query DocumentLibraryPageById($pageId: String!, $siteId: String!) {
    contentfulDocumentLibraryPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      ...PageFragment
      description {
        json
      }
      source
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
