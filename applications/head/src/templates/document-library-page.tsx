import React from "react";
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
import RichText from "../components/RichText";

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

const DocumentLibraryPage = ({ data }: Props) => {
  const {
    title,
    description,
    documents,
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

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
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
                  <Grid item xs={12} md={6} lg={3}>
                    Filters will go here.
                  </Grid>
                  <Grid item xs={12} md={6} lg={9}>
                    <DocumentResults
                      data={documents}
                      format={resultTypeFormatMap[source][resultsType]}
                    />
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
