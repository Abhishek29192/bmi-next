import CarouselHero from "@bmi-digital/components/carousel-hero";
import { useIsClient } from "@bmi-digital/components/hooks";
import Search from "@bmi-digital/components/search";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import Brands, { Data as BrandData } from "../components/Brands";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as SiteData } from "../components/Site";
import WelcomeDialog from "../components/WelcomeDialog";
import { useConfig } from "../contexts/ConfigProvider";
import { getPathWithCountryCode } from "../utils/path";
import { getHeroItemsWithContext } from "./helpers/getHeroItemsWithContext";
import type { Data as SlideData } from "../components/Promo";
import type { Data as PageInfoData } from "../components/PageInfo";

export type HomepageData = {
  __typename: "ContentfulHomePage";
  title: string;
  slides: readonly [SlideData | PageInfoData, ...(SlideData | PageInfoData)[]];
  overlapCards: OverlapCardData | null;
  brands: [BrandData, ...BrandData[]] | null;
  sections: SectionsData | null;
} & PageData;

export type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

const HomePage = ({ data, pageContext }: Props) => {
  const {
    __typename,
    title,
    slides,
    overlapCards,
    brands,
    sections,
    signupBlock,
    seo
  } = data.contentfulHomePage;
  const pageData: PageData = {
    breadcrumbs: null,
    signupBlock,
    seo,
    path: data.contentfulHomePage.path
  };
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } =
    data.contentfulSite.resources || {};

  const { isGatsbyDisabledElasticSearch } = useConfig();
  const { isClient } = useIsClient();

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext.variantCodeToPathMap}
      ogImageUrl={slides[0].featuredMedia?.image?.file.url}
      pageType="homePage"
    >
      {({ siteContext }) => {
        const { countryCode, getMicroCopy } = siteContext;
        const heroItems = getHeroItemsWithContext(siteContext, slides);

        return (
          <>
            <CarouselHero
              heroes={heroItems}
              hasSpaceBottom
              disableLazyLoading={true}
            >
              {!isGatsbyDisabledElasticSearch && (
                <Search
                  gtm={{
                    id: "search2",
                    label: getMicroCopy(microCopy.SEARCH_LABEL)
                  }}
                  action={getPathWithCountryCode(countryCode, "search")}
                  label={getMicroCopy(microCopy.SEARCH_LABEL)}
                  placeholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HERO)}
                />
              )}
            </CarouselHero>
            {overlapCards && <OverlapCards data={overlapCards} />}
            {brands && <Brands data={brands} />}
            {sections && (
              <Sections
                data-testid="homepage-sections"
                data={sections}
                pageTypename={__typename}
              />
            )}
            {isClient &&
              welcomeDialogTitle &&
              welcomeDialogBody &&
              welcomeDialogBrands && (
                <WelcomeDialog
                  data={{
                    welcomeDialogTitle,
                    welcomeDialogBody,
                    welcomeDialogBrands
                  }}
                />
              )}
          </>
        );
      }}
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      __typename
      # Only fetching slug to get it in the JSON file so it's indexed
      slug
      title
      slides {
        ... on ContentfulPromoOrPage {
          ...PromoHeroFragment
          ...PageInfoHeroFragment
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
      signupBlock {
        ...SignupBlockFragment
      }
      seo {
        ...SEOContentFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
