import React from "react";
import { graphql } from "gatsby";
import Hero, { HeroItem } from "@bmi/hero";
import Section from "@bmi/section";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
// import Search from "@bmi/search";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import { getCTA } from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import BrandLogo from "../components/BrandLogo";

type BrandLandingPageData = PageInfoData &
  PageData & {
    description: null | { description: string };
    slides: (SlideData | PageInfoData)[];
    overlapCards: OverlapCardData | null;
    sections: SectionsData;
    breadcrumbs: BreadcrumbsData;
  };

type Props = {
  data: {
    contentfulBrandLandingPage: BrandLandingPageData;
    contentfulSite: SiteData;
  };
};

const getHeroItemsWithContext = (
  { getMicroCopy, countryCode },
  slides: BrandLandingPageData["slides"]
): HeroItem[] => {
  return slides.map(({ title, subtitle, featuredImage, ...rest }) => {
    return {
      title,
      children: subtitle,
      imageSource: featuredImage?.resize.src,
      CTA: getCTA(rest, countryCode, getMicroCopy("page.linkLabel"))
    };
  });
};

const BrandLandingPage = ({ data }: Props) => {
  const {
    title,
    description,
    brandLogo,
    featuredImage,
    slides,
    overlapCards,
    sections,
    inputBanner,
    breadcrumbs
  } = data.contentfulBrandLandingPage;
  const pageData: PageData = {
    path: null,
    inputBanner
  };
  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <SiteContext.Consumer>
        {(context) => {
          // const { getMicroCopy } = context;
          const heroItems = getHeroItemsWithContext(context, slides);
          const firstSlide: HeroItem = {
            title: <BrandLogo brandName={brandLogo} />,
            children: description?.description,
            imageSource: featuredImage?.resize.src,
            hasUnderline: false
          };

          return (
            <Hero
              level={0}
              breadcrumbs={<Breadcrumbs data={breadcrumbs} isDarkThemed />}
              heroes={[firstSlide, ...heroItems]}
              hasSpaceBottom
            >
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
      {sections && <Sections data={sections} />}
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs data={breadcrumbs} />
      </Section>
    </Page>
  );
};

export default BrandLandingPage;

export const pageQuery = graphql`
  query BrandLandingPageById($pageId: String!, $siteId: String!) {
    contentfulBrandLandingPage(id: { eq: $pageId }) {
      description {
        description
      }
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
      parentPage {
        ...PageInfoFragment
      }
      ...PageInfoFragment
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
