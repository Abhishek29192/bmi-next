import React from "react";
import { graphql } from "gatsby";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as InputBannerData } from "../components/InputBanner";
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
import { getCTA } from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";

type HomepageData = {
  title: string;
  slides: (SlideData | PageInfoData)[];
  overlapCards: OverlapCardData;
  sections: SectionsData | null;
  inputBanner: InputBannerData | null;
};

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
};

const getHeroItemsWithContext = (
  { getMicroCopy, countryCode },
  slides: HomepageData["slides"]
): HeroItem[] => {
  return slides.map(({ title, subtitle, featuredImage, ...rest }) => {
    return {
      title,
      children: subtitle,
      imageSource: featuredImage?.file.url,
      CTA: getCTA(rest, countryCode, getMicroCopy("page.linkLabel"))
    };
  });
};

const HomePage = ({ data }: Props) => {
  const {
    title,
    slides,
    overlapCards,
    sections,
    inputBanner
  } = data.contentfulHomePage;
  const pageData: PageData = {
    slug: null,
    inputBanner
  };

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

      <OverlapCards data={overlapCards} />
      {sections && <Sections data={sections} />}
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      title
      slides {
        ... on ContentfulPromoOrPage {
          ...PromoFragment
          ...PageInfoFragment
        }
      }
      overlapCards {
        ...OverlapCardFragment
      }
      sections {
        ...SectionsFragment
      }
      inputBanner {
        ...InputBannerFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
