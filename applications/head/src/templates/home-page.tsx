import React from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import Hero, { Data as HeroData } from "../components/Hero";
import Sections, { Data as SectionsData } from "../components/Sections";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";

type PageInfoData = {
  title: string;
};

type HomepageData = PageInfoData &
  PageData & {
    heroes: HeroData[];
    overlapCards: OverlapCardData;
    sections: SectionsData | null;
  };

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
};

const HomePage = ({ data }: Props) => {
  const {
    title,
    heroes,
    overlapCards,
    sections,
    ...pageData
  } = data.contentfulHomePage;
  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero data={heroes} hasSpaceBottom />
      <Container>
        <OverlapCards data={overlapCards} />
      </Container>
      {sections && <Sections data={sections} />}
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      title
      showSignUpBanner
      heroes {
        ...HeroFragment
      }
      overlapCards {
        ...OverlapCardFragment
      }
      sections {
        # TODO: This should be SectionFragment, but there is no data for that atm
        ...TwoPaneCarouselSectionFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
