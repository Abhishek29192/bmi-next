import React from "react";
import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import SimplePage, { Data } from "../components/simple-page";
import { Data as LeadBlockSectionData } from "../../../components/LeadBlockSection";
import { Data as ShareWidgetSectionData } from "../../../components/ShareWidgetSection";
import { Data as SectionsData } from "../../../components/Sections";
import { Data as NextBestActionsData } from "../../../components/NextBestActions";
import { Data as ExploreBarData } from "../../../components/ExploreBar";
import { Data as LinkColumnsSectionData } from "../../../components/LinkColumnsSection";
import { Data as LinkData } from "../../../components/Link";
import { PageContextType } from "../../productListerPage/components/product-lister-page";
import ProvideStyles from "../../../components/__tests__/utils/StylesProvider";
import {
  cta,
  exploreBarData,
  featuredMedia,
  linkColumnsData,
  nextBestActions,
  pageContext,
  sections,
  shareWidgetData,
  leadBlockData,
  inputBanner
} from "../__mocks__/mocks";
import { createMockSiteData } from "../../../test/mockSiteData";
import { ConfigProviderMock } from "../../../components/__tests__/utils/ConfigProviderMock";

const route = "/jest-test-page";
const history = createHistory(createMemorySource(route));

const renderWithStylesAndLocationProvider = (
  pageData: any,
  pageContext: PageContextType
): RenderResult => {
  return render(
    <ConfigProviderMock customConfig={{ brandProviderToggler: true }}>
      <ProvideStyles>
        <LocationProvider history={history}>
          <SimplePage data={pageData} pageContext={pageContext} />
        </LocationProvider>
      </ProvideStyles>
    </ConfigProviderMock>
  );
};

const data: { contentfulSimplePage: Data; contentfulSite: any } = {
  contentfulSimplePage: {
    // Data
    id: "simplePage",
    title: "Simple page",
    subtitle: "Simple page subtitle",
    brandLogo: "brandLogo",
    slug: "simple-page",
    date: "2021-06-02T00:00:00",
    tags: [{ type: "Page type", title: "PSimple page type" }],
    featuredVideo: null,
    // PageData
    inputBanner,
    seo: {
      metaTitle: "BMI - simple page",
      metaDescription: "BMI - simple page"
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
        heroType: "Spotlight",
        sections: [],
        exploreBarData: null,
        leadBlock: null
      }
    };
    const { getByTestId } = renderWithStylesAndLocationProvider(
      customData,
      pageContext
    );
    expect(getByTestId("spotLightHero")).toBeTruthy();
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
    const ogImageTag = Array.from(document.getElementsByTagName("meta")).find(
      (meta) => meta.getAttribute("property") === "og:image"
    );
    expect(ogImageTag).toBeFalsy();
  });
});
