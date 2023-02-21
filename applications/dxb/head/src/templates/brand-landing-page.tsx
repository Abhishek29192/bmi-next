/* eslint-disable @typescript-eslint/no-unused-vars */
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
import type { Data as PageInfoData } from "../components/PageInfo";
import type { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
import type { Data as SiteData } from "../components/Site";
import { renderVideo } from "../components/Video";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";

type BrandLandingPageData = Omit<PageInfoData, "sections"> &
  Omit<PageData, "breadcrumbs"> & {
    description: null | { description: string };
    slides: (SlideData | PageInfoData)[];
    overlapCards: OverlapCardData | null;
    sections: SectionsData;
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
  { getMicroCopy },
  slides: BrandLandingPageData["slides"]
): CarouselHeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }) => {
      return {
        title,
        children: subtitle,
        media: featuredVideo ? (
          renderVideo(featuredVideo)
        ) : (
          <Image data={featuredMedia} size="cover" />
        ),
        cta:
          rest.__typename === "ContentfulPromo" ? (
            <Link component={Button} data={rest.cta}>
              {rest.cta?.label}
            </Link>
          ) : (
            <Link component={Button} data={{ linkedPage: { path: rest.path } }}>
              {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
            </Link>
          )
      };
    }
  );
};

const BrandLandingPage = ({ data, pageContext }: Props) => {
  const {
    title,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    seo,
    featuredVideo
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
  const {
    config: { isBrandProviderEnabled }
  } = useConfig();

  const GTMButton = withGTM<ButtonProps>(Button);
  const firstSlide: CarouselHeroItem = {
    title: <BrandLogo brandName={brandLogo} brandWhiteBox={true} />,
    //DXB-2102 truncate description to 400 characters
    children: description?.description
      ? `${description?.description.substring(0, 400)}${
          description?.description.length > 400 ? "..." : ""
        }`
      : null,
    media: featuredVideo ? (
      renderVideo(featuredVideo)
    ) : (
      <Image data={featuredMedia} size="cover" />
    ),
    hasUnderline: false,
    cta: cta ? (
      <Link component={Button} data={cta}>
        {cta.label}
      </Link>
    ) : null
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
                <BackToResults isDarkThemed>
                  <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
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
      cta {
        ...LinkFragment
      }
      slides {
        ... on ContentfulPromoOrPage {
          ...PromoFragment
          ...BasePageInfoFragment
        }
      }
      overlapCards {
        ...OverlapCardFragment
      }
      sections {
        ...SectionsFragment
      }
      parentPage {
        ...BasePageInfoFragment
      }
      ...BasePageInfoFragment
      ...PageFragment
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
