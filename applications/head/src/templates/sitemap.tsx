import React, { useContext } from "react";
import { graphql } from "gatsby";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page from "../components/Page";
import SitemapSection from "../components/SitemapSection";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

const Sitemap = ({ data }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

  const siteData = data.contentfulSite;
  const {
    footerMainNavigation,
    footerSecondaryNavigation,
    menuNavigation,
    menuUtilities
  } = siteData;

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
