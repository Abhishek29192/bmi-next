import { createEllipsis } from "@bmi-digital/components/utils";
import CarouselHero, {
  CarouselHeroItem
} from "@bmi-digital/components/carousel-hero";
import Search from "@bmi-digital/components/search";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../components/BackToResults";
import BrandLogo from "../components/BrandLogo";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Context as SiteContext } from "../components/Site";
import ButtonLink from "../components/link/ButtonLink";
import { DataTypeEnum, type Data as LinkData } from "../components/link/types";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";
import { getPathWithCountryCode } from "../utils/path";
import createImageProps from "../components/image/createImageProps";
import createVideoProps from "../components/video/createVideoProps";
import type { Data as SiteData } from "../components/Site";
import type { Data as SlideData } from "../components/Promo";
import type { Data as PageInfoData } from "../components/PageInfo";

type BrandLandingPageData = Omit<PageInfoData, "sections" | "featuredVideo"> &
  Omit<PageData, "breadcrumbs"> & {
    description: null | { description: string };
    slides: (SlideData | PageInfoData)[];
    overlapCards: OverlapCardData | null;
    sections: SectionsData | null;
    breadcrumbs: BreadcrumbsData;
    breadcrumbTitle: string;
  };

export type Props = {
  data: {
    contentfulBrandLandingPage: BrandLandingPageData;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

const getHeroItemsWithContext = (
  { getMicroCopy }: SiteContext,
  slides: BrandLandingPageData["slides"]
): CarouselHeroItem[] => {
  const GetCTAButton = (cta: LinkData | null) => {
    return cta?.label ? (
      <ButtonLink data={cta} hasBrandColours>
        {cta?.label}
      </ButtonLink>
    ) : null;
  };

  const GetCTALinkFromPath = (data: SlideData | PageInfoData) => {
    return "path" in data && data.path ? (
      <ButtonLink
        data={
          {
            type: DataTypeEnum.Internal,
            linkedPage: { path: data.path }
          } as LinkData
        }
        hasBrandColours
      >
        {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
      </ButtonLink>
    ) : null;
  };

  return slides.map((slide) => {
    const { title, subtitle, featuredMedia, featuredVideo } = slide;

    return {
      title,
      children: subtitle,
      media: featuredVideo
        ? createVideoProps(featuredVideo)
        : featuredMedia
          ? createImageProps({
              ...featuredMedia,
              size: "cover"
            })
          : undefined,
      cta:
        slide.__typename === "ContentfulPromo"
          ? GetCTAButton(slide.cta)
          : GetCTALinkFromPath(slide)
    };
  });
};

const BrandLandingPage = ({ data, pageContext }: Props) => {
  const {
    title,
    description,
    cta,
    brandLogo,
    featuredMedia,
    slides,
    overlapCards,
    sections,
    signupBlock,
    breadcrumbs,
    breadcrumbTitle,
    seo
  } = data.contentfulBrandLandingPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock,
    seo,
    path: data.contentfulBrandLandingPage.path
  };

  const firstSlide: CarouselHeroItem = {
    title: brandLogo ? (
      <BrandLogo brandName={brandLogo} brandWhiteBox={true} />
    ) : undefined,

    children:
      description?.description && createEllipsis(description.description, 400),

    media: featuredMedia
      ? createImageProps({ ...featuredMedia, size: "cover", loading: "eager" })
      : undefined,
    hasUnderline: false,
    cta: cta ? (
      <ButtonLink data={cta} data-testid="first-slide-cta" hasBrandColours>
        {cta.label}
      </ButtonLink>
    ) : undefined
  };

  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
      pageType="brandPage"
    >
      {({ siteContext }) => {
        const heroItems = getHeroItemsWithContext(siteContext, slides);
        const { countryCode, getMicroCopy } = siteContext;

        return (
          <>
            <CarouselHero
              breadcrumbs={
                <BackToResults
                  isDarkThemed
                  data-testid="breadcrumbs-section-top"
                >
                  <Breadcrumbs
                    data={enhancedBreadcrumbs}
                    data-testid="brand-landing-page-breadcrumbs-top"
                  />
                </BackToResults>
              }
              heroes={[firstSlide, ...heroItems]}
            >
              <Search
                gtm={{
                  id: "search2",
                  label: getMicroCopy(microCopy.SEARCH_LABEL),
                  action: getPathWithCountryCode(countryCode, "search")
                }}
                action={getPathWithCountryCode(countryCode, "search")}
                label={getMicroCopy(microCopy.SEARCH_LABEL)}
                placeholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HERO)}
                data-testid={"brand-search-form"}
              />
            </CarouselHero>
            {overlapCards && <OverlapCards data={overlapCards} />}
            {sections && <Sections data={sections} />}
            <Section
              backgroundColor="alabaster"
              isSlim
              data-testid="breadcrumbs-section-bottom"
            >
              <Breadcrumbs
                data={enhancedBreadcrumbs}
                data-testid="brand-landing-page-breadcrumbs-bottom"
              />
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
      cta {
        ...LinkFragment
      }
      slides {
        ... on ContentfulPromoOrPage {
          ...PromoHeroFragment
          ...PageInfoHeroFragment
        }
      }
      overlapCards {
        ...OverlapCardFragment
      }
      sections {
        ...SectionsFragment
      }
      ...PageInfoHeroFragment
      ...PageFragment
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
