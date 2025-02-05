import { graphql } from "gatsby";
import React from "react";
import ErrorFallback from "../components/ErrorFallback";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
  pageContext?: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

const GeneralError = ({ data, pageContext }: Props) => {
  const siteData = data.contentfulSite;
  const { resources } = siteData;
  const title = resources?.errorGeneral?.title || "";

  return (
    <Page
      title={title}
      pageData={{ breadcrumbs: null, signupBlock: null, seo: null, path: "" }}
      siteData={siteData}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      <ErrorFallback
        countryCode={siteData.countryCode}
        promo={resources?.errorGeneral}
      />
    </Page>
  );
};

export default GeneralError;

export const pageQuery = graphql`
  query GeneralErrorPageBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
