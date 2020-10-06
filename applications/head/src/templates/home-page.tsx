import React, { useContext } from "react";
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
    slides: ((SlideData | SimplePageSlideData | ContactUsSlideData) & {
      __typename: string;
      slug: string; // TODO: SimplePageInfoData | ContactUsInfoData only - how to conditionally apply?
      cta: SlideData["cta"]; // TODO: SimplePageInfoData | ContactUsInfoData only - how to conditionally apply?
    })[];
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
  // TODO: resources is an empty object here sine Homepage parent to Page. NEED fix.
  const { countryCode, resources } = useContext(SiteContext);

  const {
    title,
    slides,
    overlapCards,
    sections,
    ...pageData
  } = data.contentfulHomePage;

  const heroItems: HeroItem[] = slides.map(
    ({ title, subtitle, featuredImage, __typename, ...rest }) => {
      let CTA;
      if (__typename === "ContentfulPromo") {
        const { cta: ctaData } = rest;

        if (!ctaData) {
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
          // TODO: remove hardcoded resource microcopy (see resources above).
          label: "Go to page",
          // TODO: is clickable action implmented in heroes component (producing e.g. http://support-category-page/)
          action: getClickableActionFromUrl({ slug }, null, countryCode)
        };
      }
      return {
        title,
        children: subtitle,
        imageSource: featuredImage?.file.url,
        CTA
      };
    }
  );

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
        __typename
        ... on ContentfulContactUsPageContentfulPromoContentfulSimplePageUnion {
          ...ContactUsInfoFragment
          ...SimplePageInfoFragment
          ...PromoFragment
        }
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
