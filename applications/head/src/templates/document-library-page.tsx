import React from "react";
import { graphql } from "gatsby";
import Hero from "@bmi/hero";
import Grid from "@bmi/grid";
import { Data as SiteData } from "../components/Site";
import { Data as PageInfoData } from "../components/PageInfo";
import Page, { Data as PageData } from "../components/Page";
import Breadcrumbs from "../components/Breadcrumbs";
import DocumentResults, {
  Data as DocumentResultsData
} from "../components/DocumentResults";
import { Document } from "@contentful/rich-text-types";

type Data = PageInfoData &
  PageData & {
    description: Document | null;
    source: "PIM" | "CMS" | "ALL";
    documents: DocumentResultsData;
  };

type Props = {
  data: {
    contentfulDocumentLibraryPage: Data;
    contentfulSite: SiteData;
  };
};

const DocumentLibraryPage = ({ data }: Props) => {
  const { title, documents } = data.contentfulDocumentLibraryPage;

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          Filters will go here.
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <DocumentResults data={documents} format="simpleTable" />
        </Grid>
      </Grid>
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
      documents {
        ...DocumentResultsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
