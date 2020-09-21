import React from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import Hero, { Data as HeroData } from "../components/Hero";
import OverlapCard, {
  Data as OverlapCardData
} from "../components/OverlapCard";

type HomepageData = PageData & {
  heroes: HeroData[];
  overlapCards: OverlapCardData;
};

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
};

const HomePage = ({ data }: Props) => {
  const { heroes, overlapCards, ...pageData } = data.contentfulHomePage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
      <Hero data={heroes} hasSpaceBottom />
      <Container>
        <OverlapCard data={overlapCards} />
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
      heroes {
        ...HeroFragment
      }
      overlapCards {
        ...OverlapCardFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
