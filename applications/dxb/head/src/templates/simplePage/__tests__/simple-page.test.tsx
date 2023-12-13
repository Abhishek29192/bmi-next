import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render, RenderResult, screen } from "@testing-library/react";
import React from "react";
import { Data as ExploreBarData } from "../../../components/ExploreBar";
import { Data as LeadBlockSectionData } from "../../../components/LeadBlockSection";
import { Data as LinkData } from "../../../components/Link";
import { Data as LinkColumnsSectionData } from "../../../components/LinkColumnsSection";
import { Data as NextBestActionsData } from "../../../components/NextBestActions";
import { Data as SectionsData } from "../../../components/Sections";
import { Data as ShareWidgetSectionData } from "../../../components/ShareWidgetSection";
import { Data as SiteData } from "../../../components/Site";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import {
  cta,
  exploreBarData,
  featuredMedia,
  leadBlockData,
  linkColumnsData,
  nextBestActions,
  pageContext,
  sections,
  shareWidgetData,
  signupBlock
} from "../__mocks__/simplePage";
import SimplePage, { Data, Props } from "../components/simple-page";

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
          <SimplePage data={pageData} pageContext={pageContext} />
        </LocationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );

const data: { contentfulSimplePage: Data; contentfulSite: SiteData } = {
  contentfulSimplePage: {
    // Data
    id: "simplePage",
    title: "Simple page",
    subtitle: "Simple page subtitle",
    brandLogo: "Icopal",
    slug: "simple-page",
    date: "2021-06-02T00:00:00",
    rawDate: "2021-06-02T00:00:00",
    tags: [{ type: "Page type", title: "PSimple page type" }],
    featuredVideo: null,
    // PageData
    signupBlock,
    seo: {
      metaTitle: "BMI - simple page",
      metaDescription: "BMI - simple page",
      noIndex: false
    },
    path: "simple-page",
    // ContentfulSimplePageData
    __typename: "ContentfulSimplePage",
    leadBlock: leadBlockData as LeadBlockSectionData,
    shareWidget: shareWidgetData as ShareWidgetSectionData,
    sections: sections as SectionsData,
    nextBestActions: nextBestActions as NextBestActionsData,
    exploreBar: exploreBarData as ExploreBarData,
    linkColumns: linkColumnsData as LinkColumnsSectionData,
    heroType: "Hierarchy",
    parentPage: null,
    breadcrumbs: [
      {
        id: "abc123",
        label: "Simple page",
        slug: "simple-page"
      }
    ],
    breadcrumbTitle: "breadcrumbTitle",
    cta: cta as LinkData,
    featuredMedia: featuredMedia
  },
  contentfulSite: createMockSiteData()
};

describe("Simple page", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.resetModules();
  });

  it("renders correctly with full data", () => {
    const { container } = renderWithStylesAndLocationProvider(
      data,
      pageContext
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when heroType is Spotlight", () => {
    const customData = {
      ...data,
      contentfulSimplePage: {
        ...data.contentfulSimplePage,
        heroType: "Spotlight" as const,
        sections: [],
        exploreBarData: null,
        leadBlock: null
      }
    };
    renderWithStylesAndLocationProvider(customData, pageContext);
    expect(screen.getByTestId("spotLightHero")).toBeTruthy();
  });

  it("renders correctly when no feature media", () => {
    const customData = {
      ...data,
      contentfulSimplePage: {
        ...data.contentfulSimplePage,
        featuredMedia: null,
        sections: [],
        exploreBarData: null,
        leadBlock: null
      }
    };
    const { container } = renderWithStylesAndLocationProvider(
      customData,
      pageContext
    );
    expect(container).toMatchSnapshot();
    expect(
      // eslint-disable-next-line testing-library/no-node-access -- head components can't be found with screen
      document.querySelector("[data-testid='meta-og-image']")
    ).not.toBeInTheDocument();
  });
});
