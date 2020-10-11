import React from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Hero, { HeroItem } from "@bmi/hero";
import Sections, { Data as SectionsData } from "../components/Sections";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import { getClickableActionFromUrl } from "../components/Link";
import { PageInfoData as SimplePageSlideData } from "../templates/simple-page";
import { PageInfoData as ContactUsSlideData } from "../templates/contact-us-page";

type PageInfoData = {
  title: string;
};

type HomepageData = PageInfoData &
  PageData & {
    slides: (SlideData | SimplePageSlideData | ContactUsSlideData)[];
    overlapCards: OverlapCardData;
    sections: SectionsData | null;
  };

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
};

const getHeroItemsWithContext = (
  { resources, countryCode },
  slides: HomepageData["slides"]
): HeroItem[] => {
  return slides.map(({ title, subtitle, featuredImage, ...rest }) => {
    let CTA;

    if (rest.__typename === "ContentfulPromo") {
      const { cta: ctaData } = rest;
      if (ctaData) {
        CTA = {
          label: ctaData?.label,
          action: getClickableActionFromUrl(
            ctaData?.linkedPage,
            ctaData?.url,
            countryCode
          )
        };
      }
    } else {
      const { slug } = rest;
      CTA = {
        label: resources["page.linkLabel"],
        action: getClickableActionFromUrl({ slug }, null, countryCode)
      };
    }
    return {
      title,
      children: subtitle,
      imageSource: featuredImage?.file.url,
      CTA
    };
  });
};

const HomePage = ({ data }: Props) => {
  const {
    title,
    slides,
    overlapCards,
    sections,
    ...pageData
  } = data.contentfulHomePage;

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <SiteContext.Consumer>
        {(context) => {
          const heroItems = getHeroItemsWithContext(context, slides);
          return <Hero level={0} heroes={heroItems} hasSpaceBottom />;
        }}
      </SiteContext.Consumer>

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
        __typename
        ... on ContentfulContactUsPageContentfulPromoContentfulSimplePageUnion {
          ...ContactUsPageInfoFragment
          ...SimplePageInfoFragment
          ...PromoFragment
        }
      }
      overlapCards {
        ...OverlapCardFragment
      }
      sections {
        # TODO: This should be SectionFragment, but there is no data for that atm
        ...CarouselSectionFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
