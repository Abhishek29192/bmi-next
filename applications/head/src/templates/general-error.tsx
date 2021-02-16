import React from "react";
import { graphql } from "gatsby";
import { Data as SiteData } from "../components/Site";
import Page from "../components/Page";
import ErrorFallback from "../components/ErrorFallback";

type Props = {
  data: {
    contentfulSite: SiteData;
  };
};

const GeneralError = ({ data }: Props) => {
  const siteData = data.contentfulSite;
  const { errorGeneral } = siteData.resources;
  return (
    <Page
      title={errorGeneral.title}
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null }}
      siteData={siteData}
    >
      <ErrorFallback countryCode={siteData.countryCode} promo={errorGeneral} />
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
