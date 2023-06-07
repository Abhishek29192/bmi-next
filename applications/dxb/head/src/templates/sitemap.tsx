import { graphql } from "gatsby";
import React from "react";
import { generateGetMicroCopy } from "../components/MicroCopy";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";
import SitemapSection from "../components/SitemapSection";
import { microCopy } from "../constants/microCopies";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

const Sitemap = ({ data, pageContext }: Props) => {
  const siteData = data.contentfulSite;
  const {
    footerMainNavigation,
    footerSecondaryNavigation,
    menuNavigation,
    menuUtilities
  } = siteData;

  const getMicroCopy = generateGetMicroCopy(siteData.resources?.microCopy);

  return (
    <Page
      title={getMicroCopy(microCopy.GLOBAL_SITEMAP)}
      pageData={{ breadcrumbs: null, signupBlock: null, seo: null, path: null }}
      siteData={siteData}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
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
