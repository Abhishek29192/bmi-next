import React from "react";
import { graphql } from "gatsby";
import { Data as SiteData, SiteContext } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Hero, { HeroItem } from "@bmi/hero";
import Sections, { Data as SectionsData } from "../components/Sections";
// import Search from "@bmi/search";
import Section from "@bmi/section";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import { getCTA } from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";
import { iconMap } from "@bmi/logo";
import Breadcrumbs from "../components/Breadcrumbs";

type BrandLandingPageData = PageInfoData &
  PageData & {
    description: null | { description: string };
    slides: (SlideData | PageInfoData)[];
    overlapCards: OverlapCardData | null;
    sections: SectionsData;
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
      imageSource: featuredImage?.file.url,
      CTA: getCTA(rest, countryCode, getMicroCopy("page.linkLabel"))
    };
  });
};

const BrandLandingPage = ({ data }: Props) => {
  const {
    title,
    description,
    slug,
    brandLogo,
    featuredImage,
    slides,
    overlapCards,
    sections,
    inputBanner
  } = data.contentfulBrandLandingPage;
  const pageData: PageData = {
    slug: null,
    inputBanner
  };
  const BrandLogo = iconMap[brandLogo];
  const breadcrumbs = <Breadcrumbs title={title} slug={slug} isDarkThemed />;

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <SiteContext.Consumer>
        {(context) => {
          // const { getMicroCopy } = context;
          const heroItems = getHeroItemsWithContext(context, slides);
          const firstSlide: HeroItem = {
            title: <BrandLogo style={{ height: "90px" }} />,
            children: description?.description,
            imageSource: featuredImage?.file.url,
            hasUnderline: false
          };

          return (
            <Hero
              level={0}
              breadcrumbs={breadcrumbs}
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
        <Breadcrumbs title={title} slug={slug} />
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
      ...PageInfoFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
