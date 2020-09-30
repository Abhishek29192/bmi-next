import React from "react";
import { graphql } from "gatsby";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import { Data as SiteData } from "../components/Site";
import Hero, { Data as HeroData } from "../components/Hero";
import Page, { Data as PageData } from "../components/Page";
import { Data as TitleWithContentData } from "../components/TitleWithContent";
import TabsOrAccordionSection from "../components/TabsOrAccordionSection";
import ExpandableCard from "../components/ExpandableCards";

type PageInfoData = {
  title: string;
  subtitle: string | null;
  featuredImage: {
    title: string;
    file: {
      fileName: string;
      url: string;
    };
  } | null;
};

type Data = PageInfoData &
  PageData & {
    hero: HeroData;
    queriesTitle: string;
    queriesSubtitle: string;
    otherAreasTitle: string;
    otherAreas: readonly TitleWithContentData[];
  };

type Props = {
  data: {
    contentfulContactUsPage: Data;
    contentfulSite: SiteData;
  };
};

const ContactUsPage = ({ data }: Props) => {
  const {
    title,
    subtitle,
    featuredImage,
    queriesTitle,
    queriesSubtitle,
    otherAreasTitle,
    otherAreas,
    ...pageData
  } = data.contentfulContactUsPage;
  const hero = {
    title,
    subtitle: {
      subtitle
    },
    image: featuredImage,
    cta: null,
    brandLogo: null
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero data={[hero]} />
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
        data={{
          __typename: "ContentfulTabsOrAccordionSection",
          title: otherAreasTitle,
          description: null,
          items: otherAreas,
          type: "Accordion"
        }}
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
      # Check length allowed and define right field type
      # subtitle
      featuredImage {
        title
        file {
          fileName
          url
        }
      }
      showSignUpBanner
      hero {
        ...HeroFragment
      }
      queriesTitle
      queriesSubtitle
      otherAreasTitle
      otherAreas {
        ...TitleWithContentFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
