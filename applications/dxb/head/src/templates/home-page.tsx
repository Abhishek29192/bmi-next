import {
  Button,
  ButtonProps,
  CarouselHero,
  Search
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import Brands, { Data as BrandData } from "../components/Brands";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import type { Data as PageInfoData } from "../components/PageInfo";
import type { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as SiteData } from "../components/Site";
import WelcomeDialog from "../components/WelcomeDialog";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { getHeroItemsWithContext } from "./helpers/getHeroItemsWithContext";

export type HomepageData = {
  __typename: "ContentfulHomePage";
  title: string;
  slides: (SlideData | PageInfoData)[];
  overlapCards: OverlapCardData;
  brands: BrandData[];
  spaBrands: BrandData[];
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
    spaBrands,
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

  const GTMButton = withGTM<ButtonProps>(Button);
  const {
    config: { isSpaEnabled, isGatsbyDisabledElasticSearch }
  } = useConfig();

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={
        !isSpaEnabled ? slides?.[0]?.featuredMedia?.image?.file.url : ""
      }
    >
      {({ siteContext }) => {
        const { countryCode, getMicroCopy } = siteContext;
        const heroItems = getHeroItemsWithContext(siteContext, slides);

        return (
          <>
            <CarouselHero heroes={heroItems} hasSpaceBottom>
              {!isGatsbyDisabledElasticSearch && (
                <Search
                  buttonComponent={(props) => (
                    <GTMButton
                      gtm={{
                        id: "search2",
                        label: getMicroCopy(microCopy.SEARCH_LABEL)
                      }}
                      {...props}
                    />
                  )}
                  action={getPathWithCountryCode(countryCode, "search")}
                  label={getMicroCopy(microCopy.SEARCH_LABEL)}
                  placeholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HERO)}
                />
              )}
            </CarouselHero>
            {overlapCards && <OverlapCards data={overlapCards} />}
            {spaBrands?.length ? (
              <Brands data={spaBrands} spaBrand />
            ) : brands?.length ? (
              <Brands data={brands} />
            ) : null}

            {sections && <Sections data={sections} pageTypename={__typename} />}
            <WelcomeDialog
              data={{
                welcomeDialogTitle,
                welcomeDialogBody,
                welcomeDialogBrands
              }}
            />
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
      spaBrands {
        ...SPABrandFragment
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
