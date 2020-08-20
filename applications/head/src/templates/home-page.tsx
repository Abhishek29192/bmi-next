import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { PageData, SiteData } from "./types";

type Props = {
  data: {
    contentfulHomePage: PageData;
    contentfulSite: SiteData;
  };
};

const HomePage = ({ data }: Props) => {
  return (
    <Page pageData={data.contentfulHomePage} siteData={data.contentfulSite}>
      HOME PAGE CONTENT
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      title
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
