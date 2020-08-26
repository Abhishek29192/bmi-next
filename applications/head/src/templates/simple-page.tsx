import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { SiteData, PageData } from "./types";

type Props = {
  data: {
    contentfulSimplePage: PageData;
    contentfulSite: SiteData;
  };
};
const SimplePage = ({ data }: Props) => {
  return (
    <Page pageData={data.contentfulSimplePage} siteData={data.contentfulSite}>
      SIMPLE PAGE CONTENT
    </Page>
  );
};

export default SimplePage;

export const pageQuery = graphql`
  query SimplePageById($pageId: String!, $siteId: String!) {
    contentfulSimplePage(id: { eq: $pageId }) {
      title
      slug
      showSignUpBanner
      hero {
        title
        subtitle {
          subtitle
        }
        image {
          title
          file {
            fileName
            url
          }
        }
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      footerMainNavigation {
        ...FooterMainNavigationFragment
      }
      footerSecondaryNavigation {
        ...FooterSecondaryNavigationFragment
      }
      ...SignUpFragment
    }
  }
`;
