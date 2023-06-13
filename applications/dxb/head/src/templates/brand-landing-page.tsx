import {
  Button,
  ButtonProps,
  CarouselHero,
  CarouselHeroItem,
  Search,
  Section
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../components/BackToResults";
import BrandLogo from "../components/BrandLogo";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import Image from "../components/Image";
import Link from "../components/Link";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Context as SiteContext } from "../components/Site";
import Video from "../components/Video";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import type { Data as SiteData } from "../components/Site";
import type { Data as SlideData } from "../components/Promo";
import type { Data as PageInfoData } from "../components/PageInfo";
import type { Data as LinkData } from "../components/Link";

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
      <Link component={Button} data={cta}>
        {cta?.label}
      </Link>
    ) : null;
  };

  const GetCTALinkFromPath = (data: SlideData | PageInfoData) => {
    return "path" in data && data.path ? (
      <Link component={Button} data={{ linkedPage: { path: data.path } }}>
        {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
      </Link>
    ) : null;
  };

  return slides.map((slide) => {
    const { title, subtitle, featuredMedia, featuredVideo } = slide;

    return {
      title,
      children: subtitle,
      media: featuredVideo ? (
        <Video {...featuredVideo} />
      ) : featuredMedia ? (
        <Image {...featuredMedia} size="cover" />
      ) : undefined,
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
  const { isBrandProviderEnabled } = useConfig();

  const GTMButton = withGTM<ButtonProps>(Button);
  const firstSlide: CarouselHeroItem = {
    title: <BrandLogo brandName={brandLogo} brandWhiteBox={true} />,
    //DXB-2102 truncate description to 400 characters
    children: description?.description
      ? `${description?.description.substring(0, 400)}${
          description?.description.length > 400 ? "..." : ""
        }`
      : null,
    media: featuredMedia ? (
      <Image {...featuredMedia} size="cover" />
    ) : undefined,
    hasUnderline: false,
    cta: cta ? (
      <Link component={Button} data={cta} data-testid="first-slide-cta">
        {cta.label}
      </Link>
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
                    isDarkThemed
                    data-testid="brand-landing-page-breadcrumbs-top"
                  />
                </BackToResults>
              }
              heroes={[firstSlide, ...heroItems]}
              hasSpaceBottom
              isHeroKeyLine={Boolean(isBrandProviderEnabled && brandLogo)}
            >
              <Search
                buttonComponent={(props) => (
                  <GTMButton
                    gtm={{
                      id: "search2",
                      label: getMicroCopy(microCopy.SEARCH_LABEL)
                    }}
                    {...props}
                    data-testid={"brand-search-button"}
                  />
                )}
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
