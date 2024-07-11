import { redirect as originalRedirect } from "next/navigation";
import { render } from "@testing-library/react";
import originalGetContentfulData from "../../utils/getContentfulData";
import originalGetSections from "../fetchers/sections";
import {
  resolveBrands as originalResolveBrands,
  resolveOverlapCards as originalResolveOverlapCards
} from "../../schema/resolvers/ContentfulHomePage";
import originalResolveHeroSlides from "../../schema/resolvers/ContentfulHeroSlides";
import originalResolveSignUpBlock from "../../schema/resolvers/ContentfulSignUpBlock";
import originalResolveSite from "../../schema/resolvers/ContentfulSite";
import HomePage from "../page";
import { createMockSiteData } from "../../test/mockSiteData";
import createContentfulSite from "../../schema/resolvers/types/helpers/ContentfulSiteHelper";
import siteQuery from "../../schema/queries/site";
import homePageQuery from "../../schema/queries/homePage";
import createContentfulPromo from "../../schema/resolvers/types/helpers/ContentfulPromoHelper";
import createContentfulSignUpBlock from "../../schema/resolvers/types/helpers/ContentfulSignUpBlockHelper";
import createContentfulOverlapCard from "../../schema/resolvers/types/helpers/ContentfulOverlapCardHelper";
import createContentfulBrand from "../../schema/resolvers/types/helpers/ContentdulHomePageBrandHelper";
import createContentfulCardCollectionSection from "../../schema/resolvers/types/helpers/ContentfulCarCollectionSection";
import createNavigationData from "../../__tests__/helpers/NavigationHelper";
import createPageInfoData from "../../__tests__/helpers/PageInfoHelper";
import createOverlapCardData from "../../__tests__/helpers/OverlapCardHelper";
import originalResolveSections from "../../schema/resolvers/ContentfulSections";
import createCardCollectionSection from "../../__tests__/helpers/CardCollectionSection";
import createSignUpBlockData from "../../__tests__/helpers/SignUpBlockHelper";
import createBrandData from "../../__tests__/helpers/BrandHelper";
import regions from "../../countries/region.json";
import type { Data as HomePageData } from "../../templates/home-page";
import type { ContentfulHomePage } from "../../schema/resolvers/types/HomePage";

const homePageDataMock: ContentfulHomePage = {
  __typename: "HomePage",
  title: "Home page title",
  slidesCollection: { items: [createContentfulPromo()] },
  overlapCardsCollection: {
    items: [createContentfulOverlapCard(), createContentfulOverlapCard()]
  },
  sectionsCollection: { items: [{ sys: { id: "section-id" } }] },
  signupBlock: createContentfulSignUpBlock(),
  seo: {
    metaTitle: "Meta title",
    metaDescription: "Meta description",
    noIndex: false,
    sameAs: null
  }
};

const homePageMock = jest.fn();
jest.mock("../../templates/home-page", () => ({
  __esModule: true,
  default: (homePageData: HomePageData) => homePageMock(homePageData)
}));

const redirectMock = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: Parameters<typeof originalRedirect>) =>
    redirectMock(...args)
}));

const getContentfulDataMock = jest.fn();
jest.mock("../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

const getMenuNavigationDataMock = jest.fn();
jest.mock("../fetchers/navigation", () => ({
  getMenuNavigationData: () => getMenuNavigationDataMock()
}));

const getSectionsMock = jest.fn();
jest.mock("../fetchers/sections", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetSections>) =>
    getSectionsMock(...args)
}));

const resolveBrandsMock = jest.fn();
const resolveOverlapCardsMock = jest.fn();
jest.mock("../../schema/resolvers/ContentfulHomePage", () => ({
  resolveBrands: (...args: Parameters<typeof originalResolveBrands>) =>
    resolveBrandsMock(...args),
  resolveOverlapCards: (
    ...args: Parameters<typeof originalResolveOverlapCards>
  ) => resolveOverlapCardsMock(...args)
}));

const resolveHeroSlidesMock = jest.fn();
jest.mock("../../schema/resolvers/ContentfulHeroSlides", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalResolveHeroSlides>) =>
    resolveHeroSlidesMock(...args)
}));

const resolveSignUpBlockMock = jest.fn();
jest.mock("../../schema/resolvers/ContentfulSignUpBlock", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalResolveSignUpBlock>) =>
    resolveSignUpBlockMock(...args)
}));

const resolveSiteMock = jest.fn();
jest.mock("../../schema/resolvers/ContentfulSite", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalResolveSite>) =>
    resolveSiteMock(...args)
}));

const resolveSectionsMock = jest.fn();
jest.mock("../../schema/resolvers/ContentfulSections", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalResolveSections>) =>
    resolveSectionsMock(...args)
}));

afterEach(() => {
  jest.clearAllMocks();
});

const brand = createBrandData();
const signUpBlockData = createSignUpBlockData();
const siteData = createMockSiteData();
const menuNavigation = createNavigationData();
const overlapCards = [createOverlapCardData()];
const sections = [createCardCollectionSection()];
const heroSlides = [createPageInfoData()];
const contentfulSections = [createContentfulCardCollectionSection()];

beforeEach(() => {
  resolveSiteMock.mockResolvedValue(siteData);
  getSectionsMock.mockResolvedValue(contentfulSections);
  getMenuNavigationDataMock.mockResolvedValue(menuNavigation);
  resolveHeroSlidesMock.mockResolvedValue(heroSlides);
  resolveOverlapCardsMock.mockResolvedValue(overlapCards);
  resolveSectionsMock.mockResolvedValue(sections);
  resolveSignUpBlockMock.mockResolvedValue(signUpBlockData);
  resolveBrandsMock.mockResolvedValue([brand]);
});

describe("HomePage", () => {
  it("should redirect to 402 page if 'Site' request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    getContentfulDataMock.mockResolvedValue({ errors });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(errors);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(siteQuery, {
      countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE
    });
  });

  it("should redirect to 402 page if 'Site' request fails", async () => {
    const error = new Error("Site request failed");
    getContentfulDataMock.mockRejectedValue(error);

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(siteQuery, {
      countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE
    });
  });

  it("should redirect to 402 page if 'Site' resolver fails", async () => {
    const error = new Error("Site resolver failed");
    getContentfulDataMock.mockResolvedValue({
      data: { siteCollection: { items: [createContentfulSite()] } }
    });
    resolveSiteMock.mockRejectedValue(error);

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(siteQuery, {
      countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE
    });
  });

  it("should redirect to 402 page if 'Home Page' request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({ errors });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(errors);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(homePageQuery, {
      homePageId: siteData.homePage.sys.id
    });
  });

  it("should redirect to 402 page if 'Home Page' request fails", async () => {
    const error = new Error("Home page request failed");
    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockRejectedValue(error);

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(homePageQuery, {
      homePageId: siteData.homePage.sys.id
    });
  });

  it("should redirect to 402 page if 'getSections' fails", async () => {
    const error = new Error("getSections failed");
    getSectionsMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
    expect(getSectionsMock).toHaveBeenCalledWith(["section-id"]);
  });

  it("should redirect to 402 page if 'getMenuNavigationData' fails", async () => {
    const error = new Error("getMenuNavigationData failed");
    getMenuNavigationDataMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should redirect to 402 page if 'resolveHeroSlides' fails", async () => {
    const error = new Error("resolveHeroSlides failed");
    resolveHeroSlidesMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should redirect to 402 page if 'resolveOverlapCards' fails", async () => {
    const error = new Error("resolveOverlapCards failed");
    resolveOverlapCardsMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should redirect to 402 page if 'resolveSections' fails", async () => {
    const error = new Error("resolveSections failed");
    resolveSectionsMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should redirect to 402 page if 'resolveSignUpBlock' fails", async () => {
    const error = new Error("resolveSignUpBlock failed");
    resolveSignUpBlockMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should redirect to 402 page if 'resolveBrands' fails", async () => {
    const error = new Error("resolveBrands failed");
    resolveBrandsMock.mockRejectedValue(error);

    const siteData = createContentfulSite();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [siteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: [createContentfulBrand()] }
        }
      });

    render(await HomePage());
    expect(redirectMock).toHaveBeenCalledWith("/no/422/");
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("calls HomePage component with all provided data", async () => {
    const contentfulSiteData = createContentfulSite();
    const contentfulBrands = [createContentfulBrand()];
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [contentfulSiteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: homePageDataMock,
          brandLandingPageCollection: { items: contentfulBrands }
        }
      });

    render(await HomePage());
    expect(homePageMock).toHaveBeenCalledWith({
      brands: [brand],
      homePage: {
        __typename: "HomePage",
        title: homePageDataMock.title,
        slides: heroSlides,
        overlapCards: overlapCards,
        sections: sections,
        seo: homePageDataMock.seo,
        signupBlock: signUpBlockData
      },
      site: { ...siteData, regions, menuNavigation }
    });
    expect(resolveSiteMock).toHaveBeenCalledWith(contentfulSiteData);
    expect(resolveHeroSlidesMock).toHaveBeenCalledWith(
      homePageDataMock.slidesCollection.items
    );
    expect(resolveOverlapCardsMock).toHaveBeenCalledWith(
      homePageDataMock.overlapCardsCollection.items
    );
    expect(resolveBrandsMock).toHaveBeenCalledWith(contentfulBrands);
    expect(resolveSectionsMock).toHaveBeenCalledWith(contentfulSections);
  });

  it("should return null for signupBlock if nor provided", async () => {
    const contentfulSiteData = createContentfulSite();
    const contentfulBrands = [createContentfulBrand()];
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { siteCollection: { items: [contentfulSiteData] } }
      })
      .mockResolvedValueOnce({
        data: {
          homePage: { ...homePageDataMock, signupBlock: null },
          brandLandingPageCollection: { items: contentfulBrands }
        }
      });

    render(await HomePage());
    expect(homePageMock).toHaveBeenCalledWith({
      brands: [brand],
      homePage: {
        __typename: "HomePage",
        title: homePageDataMock.title,
        slides: heroSlides,
        overlapCards: overlapCards,
        sections: sections,
        seo: homePageDataMock.seo,
        signupBlock: null
      },
      site: { ...siteData, regions, menuNavigation }
    });
  });
});
