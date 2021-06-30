import React from "react";
import { graphql } from "gatsby";
import Page, { Data as PageData } from "../components/Page";
import { Data as SiteData } from "../components/Site";
import { Data as ProductOverviewData } from "../components/ProductOverview";

export type Data = PageData & {
  productData: ProductOverviewData;
};

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
  };
  data: {
    contentfulSite: SiteData;
  };
};

const SystemDetailsPage = ({ data }: Props) => {
  return (
    <Page
      title="System Details Page Demo"
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null }}
      siteData={data.contentfulSite}
    >
      <h1>hey</h1>
    </Page>
  );
};

export default SystemDetailsPage;

export const pageQuery = graphql`
  query SystemDetailsPage($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
