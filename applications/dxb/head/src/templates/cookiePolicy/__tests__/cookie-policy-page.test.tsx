import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render, RenderResult, screen } from "@testing-library/react";
import React from "react";
import { Data as SiteData } from "../../../components/Site";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import {
  leadBlockData,
  pageContext,
  sections
} from "../__mocks__/cookiePolicyPage";
import CookiePolicyPage, {
  Data,
  Props
} from "../components/cookie-policy-page";

const route = "/jest-test-page";
const history = createHistory(createMemorySource(route));

const renderWithStylesAndLocationProvider = (
  pageData: Props["data"],
  pageContext: Props["pageContext"]
): RenderResult =>
  render(
    <ThemeProvider>
      <ConfigProvider configOverride={{ isBrandProviderEnabled: true }}>
        <LocationProvider history={history}>
          <CookiePolicyPage data={pageData} pageContext={pageContext} />
        </LocationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );

const data: { contentfulCookiePolicyPage: Data; contentfulSite: SiteData } = {
  contentfulCookiePolicyPage: {
    // Data
    id: "cookiePolicyPage",
    title: "cookie policy page",
    subtitle: "cookie policy page subtitle",
    slug: "cookie-policy-page",
    seo: {
      metaTitle: "BMI - cookie policy page",
      metaDescription: "BMI - cookie policy page",
      noIndex: false
    },
    path: "cookie-policy-page",
    __typename: "ContentfulCookiePolicyPage",
    leadBlock: leadBlockData,
    sections: sections,
    heroType: "Level 2",
    breadcrumbs: [
      {
        id: "abc123",
        label: "cookie policy page",
        slug: "cookie-policy-page"
      }
    ]
  },
  contentfulSite: createMockSiteData()
};

describe("Cookie Policy page", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.resetModules();
  });

  it("renders one trust element correctly with full data", () => {
    renderWithStylesAndLocationProvider(data, pageContext);

    expect(screen.getByTestId("lead-block-section")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "card-collection-section-ContentfulCardCollectionSectionTitle"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("ot-sdk-cookie-policy")).toBeInTheDocument();
  });
  it("renders one trust element correctly with no sections data", () => {
    const noSectionsData = {
      ...data,
      contentfulCookiePolicyPage: {
        ...data.contentfulCookiePolicyPage,
        featuredMedia: null,
        leadBlock: null,
        sections: [],
        exploreBarData: null
      }
    };
    renderWithStylesAndLocationProvider(noSectionsData, pageContext);

    expect(screen.queryByTestId("lead-block-section")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "card-collection-section-ContentfulCardCollectionSectionTitle"
      )
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("ot-sdk-cookie-policy")).toBeInTheDocument();
  });
});
