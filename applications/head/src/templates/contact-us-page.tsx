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

type Data = PageData & {
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
    hero,
    queriesTitle,
    queriesSubtitle,
    otherAreasTitle,
    otherAreas,
    ...pageData
  } = data.contentfulContactUsPage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
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
