import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { PageData, SiteData } from "./types";
import Container from "@bmi/container";

type Props = {
  data: {
    contentfulHomePage: PageData;
    contentfulSite: SiteData;
  };
};

const HomePage = ({ data }: Props) => {
  return (
    <Page pageData={data.contentfulHomePage} siteData={data.contentfulSite}>
      <Container maxWidth="lg" style={{ padding: "50px 25px" }}>
        HOME PAGE CONTENT
      </Container>
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
      countryCode
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
