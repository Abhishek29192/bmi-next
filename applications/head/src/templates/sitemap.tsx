import React from "react";
import { graphql } from "gatsby";
import { Data as SiteData } from "../components/Site";
import Page from "../components/Page";
import SitemapSection from "../components/SitemapSection";
import { generateGetMicroCopy } from "../components/MicroCopy";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

const Sitemap = ({ data }: Props) => {
  const siteData = data.contentfulSite;
  const {
    footerMainNavigation,
    footerSecondaryNavigation,
    menuNavigation,
    menuUtilities
  } = siteData;

  const getMicroCopy = generateGetMicroCopy(siteData.resources.microCopy);

  return (
    <Page
      title={getMicroCopy("global.sitemap")}
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null }}
      siteData={siteData}
    >
      {menuNavigation && <SitemapSection data={menuNavigation} />}
      {menuUtilities && <SitemapSection data={menuUtilities} />}
      {footerMainNavigation && <SitemapSection data={footerMainNavigation} />}
      {footerSecondaryNavigation && (
        <SitemapSection data={footerSecondaryNavigation} />
      )}
    </Page>
  );
};

export default Sitemap;

export const pageQuery = graphql`
  query SitemapPageBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
