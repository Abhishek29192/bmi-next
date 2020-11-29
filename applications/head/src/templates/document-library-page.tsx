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
import { Document } from "@contentful/rich-text-types";
import { SiteContext } from "../components/Site";
import AlertBanner from "@bmi/alert-banner";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import Pagination from "@bmi/pagination";
import RichText from "../components/RichText";
import styles from "./styles/document-library-page.module.scss";

type Data = PageInfoData &
  PageData & {
    description: { json: Document } | null;
    source: "PIM" | "CMS" | "ALL";
    resultsType: "Simple" | "Technical" | "Card Collection";
    documents: DocumentResultsData;
  };

type Props = {
  data: {
    contentfulDocumentLibraryPage: Data;
    contentfulSite: SiteData;
  };
};

const resultTypeFormatMap: Record<Data["resultsType"], Format> = {
  Simple: "simpleTable",
  Technical: "technicalTable",
  "Card Collection": "cards"
};

const DOCUMENTS_PER_PAGE = 20;

const DocumentLibraryPage = ({ data }: Props) => {
  const [page, setPage] = useState<number>(1);
  const {
    title,
    description,
    documents,
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

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero level={2} title={title} breadcrumbs={breadcrumbs} />
      {description && (
        <Section>
          <RichText document={description.json} />
        </Section>
      )}
      <SiteContext.Consumer>
        {({ getMicroCopy }) => {
          return (
            <DownloadList>
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
              <Section
                backgroundColor="white"
                className={styles["document-library-page"]}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={3}>
                    Filters will go here.
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <DocumentResults
                      data={documents.slice(
                        (page - 1) * DOCUMENTS_PER_PAGE,
                        (page - 1) * DOCUMENTS_PER_PAGE + DOCUMENTS_PER_PAGE
                      )}
                      format={resultTypeFormatMap[resultsType]}
                    />
                    <div className={styles["footer"]}>
                      <Pagination
                        page={page}
                        onChange={(_, page) => {
                          setPage(page);
                        }}
                        count={Math.ceil(documents.length / DOCUMENTS_PER_PAGE)}
                        className={styles["pagination"]}
                      />
                      <DownloadList.Clear
                        label={getMicroCopy("downloadList.clear")}
                        className={styles["clear-downloads"]}
                      />
                      <DownloadList.Button
                        label={`${getMicroCopy(
                          "downloadList.download"
                        )} ({{count}})`}
                        // TODO: Add actual download function here
                        // eslint-disable-next-line no-console
                        onClick={console.log}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Section>
            </DownloadList>
          );
        }}
      </SiteContext.Consumer>
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
