import React from "react";
import { graphql } from "gatsby";
import { Button } from "@bmi/components";
import { Hero, HeroItem } from "@bmi/components";
import { Section } from "@bmi/components";
import { microCopy } from "../constants/microCopies";
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
import { useConfig } from "../contexts/ConfigProvider";
import BackToResults from "../components/BackToResults";

type BrandLandingPageData = PageInfoData &
  PageData & {
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

  const firstSlide: HeroItem = {
    title: <BrandLogo brandName={brandLogo} brandWhiteBox={true} />,
    children: description?.description,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
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

        return (
          <>
            <Hero
              level={0}
              breadcrumbs={
                <BackToResults isDarkThemed>
                  <Breadcrumbs data={enhancedBreadcrumbs} isDarkThemed />
                </BackToResults>
              }
              heroes={[firstSlide, ...heroItems]}
              hasSpaceBottom
              isHeroKeyLine={Boolean(isBrandProviderEnabled && brandLogo)}
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
      cta {
        ...LinkFragment
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
