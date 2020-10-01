import React from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Hero, { HeroItem } from "@bmi/hero";
import Sections, { Data as SectionsData } from "../components/Sections";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";

type PageInfoData = {
  title: string;
};

type HomepageData = PageInfoData &
  PageData & {
    slides: SlideData[];
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
    slides,
    overlapCards,
    sections,
    ...pageData
  } = data.contentfulHomePage;

  const heroItems: HeroItem[] = slides.map(({ title, subtitle, image }) => ({
    title,
    children: subtitle,
    imageSource: image?.file.url
  }));

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero level={0} heroes={heroItems} hasSpaceBottom />
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
      slides {
        ...PromoFragment
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
