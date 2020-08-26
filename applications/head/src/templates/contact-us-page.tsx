import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { PageData, SiteData } from "./types";
import Container from "@bmi/container";

type Props = {
  data: {
    contentfulContactUsPage: PageData;
    contentfulSite: SiteData;
  };
};

const ContactUsPage = ({ data }: Props) => {
  return (
    <Page
      pageData={data.contentfulContactUsPage}
      siteData={data.contentfulSite}
    >
      <Container maxWidth="lg" style={{ padding: "50px 25px" }}>
        CONTACT US PAGE CONTENT
      </Container>
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
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
