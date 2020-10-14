import React from "react";
import { graphql } from "gatsby";
import Container from "@bmi/container";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Hero, { HeroItem } from "@bmi/hero";
import InputGroup from "@bmi/input-group";
import Button from "@bmi/button";
import TextField from "@bmi/text-field";
import SearchIcon from "@material-ui/icons/Search";
import Sections, { Data as SectionsData } from "../components/Sections";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import { getPromoOrPageCta } from "../components/Link";
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
    return {
      title,
      children: subtitle,
      imageSource: featuredImage?.file.url,
      CTA: getPromoOrPageCta(rest, countryCode, resources["page.linkLabel"])
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
          return (
            <Hero level={0} heroes={heroItems} hasSpaceBottom>
              <InputGroup
                lockBreakpoint="xs"
                input={
                  <TextField name="search" label="Search" variant="hybrid" />
                }
                button={
                  <Button accessibilityLabel="Search" isIconButton>
                    <SearchIcon />
                  </Button>
                }
              />
            </Hero>
          );
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
        ...ContactUsPageInfoFragment
        ...SimplePageInfoFragment
        ...PromoFragment
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
