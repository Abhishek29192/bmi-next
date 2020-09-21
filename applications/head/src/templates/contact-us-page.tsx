import React from "react";
import Page from "../components/Page";
import TabsOrAccordionSection from "../components/TabsOrAccordionSection";
import { graphql } from "gatsby";
import { ContactUsPageData, SiteData } from "./types";
import ExpandableCard from "../components/ExpandableCards";
import Typography from "@bmi/typography";
import Section from "@bmi/section";

type Props = {
  data: {
    contentfulContactUsPage: ContactUsPageData;
    contentfulSite: SiteData;
  };
};

const ContactUsPage = ({ data }: Props) => {
  const {
    queriesTitle,
    queriesSubtitle,
    otherAreasTitle,
    otherAreas,
    ...pageData
  } = data.contentfulContactUsPage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
      <Section backgroundColor="pearl">
        <Section.Title>{queriesTitle}</Section.Title>
        <Typography variant="h4" component="p">
          {queriesSubtitle}
        </Typography>
        <div style={{ marginTop: "40px" }}>
          <ExpandableCard />
        </div>
      </Section>
      <TabsOrAccordionSection
        title={otherAreasTitle}
        type="Accordion"
        items={otherAreas}
        backgroundColor="white"
      />
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
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
      queriesTitle
      queriesSubtitle
      otherAreasTitle
      otherAreas {
        title
        content {
          json
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
      menuNavigation {
        ...HeaderNavigationFragment
      }
      menuUtilities {
        ...HeaderUtilitiesFragment
      }
      ...SignUpFragment
    }
  }
`;
