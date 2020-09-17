import React from "react";
import Page from "../components/Page";
import TabsOrAccordionSection from "../components/TabsOrAccordionSection";
import VillainSection from "../components/VillainSection";
import { graphql } from "gatsby";
import { SiteData, PageData } from "./types";

type Props = {
  data: {
    contentfulSimplePage: PageData;
    contentfulSite: SiteData;
  };
};

const SectionsMap = {
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  ContentfulVillainSection: VillainSection
};

const SimplePage = ({ data }: Props) => {
  const { sections } = data.contentfulSimplePage;
  return (
    <Page pageData={data.contentfulSimplePage} siteData={data.contentfulSite}>
      {sections &&
        sections.map((section, index) => {
          const Component = SectionsMap[section.__typename];
          return (
            <Component
              key={`section${index}`}
              {...section}
              // TODO: Robust theme-based solution required.
              backgroundColor={index % 2 === 0 ? "pearl" : "white"}
            />
          );
        })}
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
      sections {
        __typename
        ...TabsOrAccordionSectionFragment
        ...VillainSectionFragment
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
