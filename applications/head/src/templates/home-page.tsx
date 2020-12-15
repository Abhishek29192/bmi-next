import React from "react";
import { graphql } from "gatsby";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as InputBannerData } from "../components/InputBanner";
import { Data as SlideData } from "../components/Promo";
import Hero, { HeroItem } from "@bmi/hero";
import Sections, { Data as SectionsData } from "../components/Sections";
// import Search from "@bmi/search";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import { getCTA } from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";
import Brands, { Data as BrandData } from "../components/Brands";

type HomepageData = {
  __typename: "ContentfulHomePage";
  title: string;
  slides: (SlideData | PageInfoData)[];
  overlapCards: OverlapCardData;
  brands: BrandData[];
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
    __typename,
    title,
    slides,
    overlapCards,
    brands,
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
          // const { getMicroCopy } = context;
          const heroItems = getHeroItemsWithContext(context, slides);
          return (
            <Hero level={0} heroes={heroItems} hasSpaceBottom>
              {/* NOTE: This is disabled until search gets implemented. */}
              {/* <Search
                label={getMicroCopy("search.label")}
                placeholder={getMicroCopy("search.placeholder")}
              /> */}
            </Hero>
          );
        }}
      </SiteContext.Consumer>
      {overlapCards && <OverlapCards data={overlapCards} />}
      {brands?.length ? <Brands data={brands} /> : null}
      {sections && <Sections data={sections} pageTypename={__typename} />}
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      __typename
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
      brands {
        ...BrandFragment
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
