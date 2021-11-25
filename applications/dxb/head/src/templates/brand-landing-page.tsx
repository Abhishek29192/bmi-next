import React from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import Hero, { HeroItem } from "@bmi/hero";
import Section from "@bmi/section";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Link from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import BrandLogo from "../components/BrandLogo";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";

type BrandLandingPageData = PageInfoData &
  PageData & {
    description: null | { description: string };
    slides: (SlideData | PageInfoData)[];
    overlapCards: OverlapCardData | null;
    sections: SectionsData;
    breadcrumbs: BreadcrumbsData;
    breadcrumbTitle: string;
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
  { getMicroCopy },
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
        cta:
          rest.__typename === "ContentfulPromo" ? (
            <Link component={Button} data={rest.cta}>
              {rest.cta?.label}
            </Link>
          ) : (
            <Link component={Button} data={{ linkedPage: { path: rest.path } }}>
              {getMicroCopy("page.linkLabel")}
            </Link>
          )
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
    breadcrumbTitle,
    seo,
    featuredVideo
  } = data.contentfulBrandLandingPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    inputBanner,
    seo,
    path: data.contentfulBrandLandingPage.path
  };

  const firstSlide: HeroItem = {
    title: <BrandLogo brandName={brandLogo} />,
    children: description?.description,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
    hasUnderline: false
  };

  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      {({ siteContext }) => {
        const heroItems = getHeroItemsWithContext(siteContext, slides);

        return (
          <>
            <Hero
              level={0}
              brand={brandLogo}
              breadcrumbs={
                <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
              }
              heroes={[firstSlide, ...heroItems]}
              hasSpaceBottom
            />

            {overlapCards && <OverlapCards data={overlapCards} />}
            {sections && <Sections data={sections} />}
            <Section backgroundColor="alabaster" isSlim>
              <Breadcrumbs data={enhancedBreadcrumbs} />
            </Section>
          </>
        );
      }}
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
