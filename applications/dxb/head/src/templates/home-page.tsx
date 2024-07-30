"use client";

import { useIsClient } from "@bmi-digital/components/hooks";
import React from "react";
import Search from "@bmi-digital/components/search";
import { microCopy } from "@bmi/microcopies";
import CarouselHero from "@bmi-digital/components/carousel-hero";
import Brands from "../components/Brands";
import OverlapCards from "../components/OverlapCards";
import Page from "../components/Page";
import Sections from "../components/Sections";
import WelcomeDialog from "../components/WelcomeDialog";
import { getPathWithCountryCode } from "../utils/path";
import { useConfig } from "../contexts/ConfigProvider";
import { getHeroItemsWithContext } from "./helpers/getHeroItemsWithContext";
import type { Data as SEOContentData } from "../components/SEOContent";
import type { Data as SignUpBlockData } from "../components/SignupBlock";
import type { Data as OverlapCardData } from "../components/OverlapCards";
import type { Data as BrandData } from "../components/Brands";
import type { Data as SiteData } from "../components/Site";
import type { Data as SectionsData } from "../components/Sections";
import type { Data as SlideData } from "../components/Promo";
import type { Data as PageInfoData } from "../components/PageInfo";

type HomePageData = {
  __typename: "HomePage";
  title: string;
  slides: readonly (SlideData | PageInfoData)[];
  overlapCards: OverlapCardData;
  sections: SectionsData | null;
  seo: SEOContentData | null;
  signupBlock: SignUpBlockData | null;
};

export type Data = {
  homePage: HomePageData;
  brands: BrandData[];
  site: SiteData;
};

const HomePage = ({ brands, homePage, site }: Data) => {
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } =
    site.resources || {};

  const { isNextDisabledElasticSearch } = useConfig();
  const { isClient } = useIsClient();

  return (
    <Page
      title={homePage.title}
      siteData={site}
      pageData={{
        breadcrumbs: null,
        path: getPathWithCountryCode(process.env.NEXT_PUBLIC_SPACE_MARKET_CODE),
        seo: homePage.seo,
        signupBlock: homePage.signupBlock
      }}
      pageType="homePage"
      ogImageUrl={homePage.slides[0].featuredMedia?.image?.url}
    >
      {({ siteContext }) => {
        const { countryCode, getMicroCopy } = siteContext;
        const heroItems = getHeroItemsWithContext(siteContext, homePage.slides);

        return (
          <>
            <CarouselHero
              heroes={heroItems}
              hasSpaceBottom
              disableLazyLoading={true}
            >
              {!isNextDisabledElasticSearch && (
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
            {homePage.overlapCards.length && (
              <OverlapCards data={homePage.overlapCards} />
            )}
            {brands.length && <Brands data={brands} />}
            {homePage.sections?.length && (
              <Sections
                data-testid="homepage-sections"
                data={homePage.sections}
                pageTypename={homePage.__typename}
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
