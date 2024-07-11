import { redirect } from "next/navigation";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import resolveContentfulSite from "../schema/resolvers/ContentfulSite";
import resolveHeroSlides from "../schema/resolvers/ContentfulHeroSlides";
import getContentfulData from "../utils/getContentfulData";
import {
  resolveBrands,
  resolveOverlapCards
} from "../schema/resolvers/ContentfulHomePage";
import homePageQuery from "../schema/queries/homePage";
import siteQuery from "../schema/queries/site";
import resolveSections from "../schema/resolvers/ContentfulSections";
import resolveSignUpBlock from "../schema/resolvers/ContentfulSignUpBlock";
import HomePageComponent from "../templates/home-page";
import regions from "../countries/region.json";
import { getMenuNavigationData } from "./fetchers/navigation";
import getSections from "./fetchers/sections";
import type { ContentfulSite } from "../schema/resolvers/types/Site";
import type {
  ContentfulHomePage,
  ContentfulBrand
} from "../schema/resolvers/types/HomePage";
import type { Data as HomePageData } from "../templates/home-page";

async function getData(): Promise<
  | {
      homePage: HomePageData["homePage"];
      brands: HomePageData["brands"];
      site: HomePageData["site"];
    }
  | undefined
> {
  try {
    const siteData = await getContentfulData<{
      siteCollection: { items: [ContentfulSite] };
    }>(siteQuery, {
      countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE
    });

    if (siteData.errors) {
      console.error(siteData.errors);
      return;
    }

    const resolvedSite = await resolveContentfulSite(
      siteData.data.siteCollection.items[0]
    );

    const homePageData = await getContentfulData<{
      homePage: ContentfulHomePage;
      brandLandingPageCollection: {
        items: ContentfulBrand[];
      };
    }>(homePageQuery, {
      homePageId: resolvedSite.homePage.sys.id
    });

    if (homePageData.errors) {
      console.error(homePageData.errors);
      return;
    }

    const {
      data: {
        homePage: {
          slidesCollection,
          overlapCardsCollection,
          sectionsCollection,
          signupBlock,
          ...homePage
        },
        brandLandingPageCollection
      }
    } = homePageData;

    const sectionIds = sectionsCollection?.items.map(({ sys }) => sys.id);
    const sections = sectionIds && (await getSections(sectionIds));

    const menuNavigation = await getMenuNavigationData();

    return {
      site: {
        ...resolvedSite,
        regions,
        menuNavigation
      },
      homePage: {
        ...homePage,
        slides: await resolveHeroSlides(slidesCollection.items),
        overlapCards: await resolveOverlapCards(overlapCardsCollection.items),
        sections: sections ? await resolveSections(sections) : null,
        signupBlock: signupBlock ? await resolveSignUpBlock(signupBlock) : null
      },
      brands: await resolveBrands(brandLandingPageCollection.items)
    };
  } catch (err) {
    console.error(err);
  }
}

export default async function HomePage() {
  const data = await getData();

  if (!data) {
    return redirect(
      getPathWithCountryCode(process.env.NEXT_PUBLIC_SPACE_MARKET_CODE, "422")
    );
  }

  return (
    <HomePageComponent
      brands={data.brands}
      homePage={data.homePage}
      site={data.site}
    />
  );
}
