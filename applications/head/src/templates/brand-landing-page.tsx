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
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";

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
  pageContext: {
    variantCodeToPathMap: Record<string, string>;
  };
};

const getHeroItemsWithContext = (
  { getMicroCopy, countryCode },
  slides: BrandLandingPageData["slides"]
): HeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }) => {
      return {
        title,
        children: subtitle,
        media: featuredVideo
          ? renderVideo(featuredVideo)
          : renderImage(featuredMedia, { size: "cover" }),
        cta: getCTA(rest, countryCode, getMicroCopy("page.linkLabel"))
      };
    }
  );
};

const BrandLandingPage = ({ data, pageContext }: Props) => {
  const {
    title,
    description,
    brandLogo,
    featuredMedia,
    slides,
    overlapCards,
    sections,
    inputBanner,
    breadcrumbs,
    seo,
    featuredVideo
  } = data.contentfulBrandLandingPage;
  const pageData: PageData = {
    breadcrumbs,
    inputBanner,
    seo
  };

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      <SiteContext.Consumer>
        {(context) => {
          // const { getMicroCopy } = context;
          const heroItems = getHeroItemsWithContext(context, slides);
          const firstSlide: HeroItem = {
            title: <BrandLogo brandName={brandLogo} />,
            children: description?.description,
            imageSource: featuredVideo
              ? renderVideo(featuredVideo)
              : featuredMedia?.image?.resize.src,
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
      parentPage {
        ...PageInfoFragment
      }
      ...PageInfoFragment
      ...PageFragment
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
