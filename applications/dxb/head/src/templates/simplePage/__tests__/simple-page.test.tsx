import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render, RenderResult } from "@testing-library/react";
import React from "react";
import { Data as ExploreBarData } from "../../../components/ExploreBar";
import { Data as LeadBlockSectionData } from "../../../components/LeadBlockSection";
import { Data as LinkData } from "../../../components/Link";
import { Data as LinkColumnsSectionData } from "../../../components/LinkColumnsSection";
import { Data as NextBestActionsData } from "../../../components/NextBestActions";
import { Data as SectionsData } from "../../../components/Sections";
import { Data as ShareWidgetSectionData } from "../../../components/ShareWidgetSection";
import { Data as SiteData } from "../../../components/Site";
import { Data as VideoData } from "../../../components/Video";
import { createMockedYoutubeVideo } from "../../../components/__tests__/helpers/mediaHelper";
import ProvideStyles from "../../../components/__tests__/utils/StylesProvider";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import SimplePage, { Data, Props } from "../components/simple-page";
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

const renderVideo = jest.fn();
jest.mock("../../../components/Video", () => ({
  renderVideo: (data: VideoData) => renderVideo(data)
}));

const route = "/jest-test-page";
const history = createHistory(createMemorySource(route));

const renderWithStylesAndLocationProvider = (
  pageData: Props["data"],
  pageContext: Props["pageContext"]
): RenderResult =>
  render(
    <ConfigProvider configObject={{ isBrandProviderEnabled: true }}>
      <ProvideStyles>
        <LocationProvider history={history}>
          <SimplePage data={pageData} pageContext={pageContext} />
        </LocationProvider>
      </ProvideStyles>
    </ConfigProvider>
  );

const data: { contentfulSimplePage: Data; contentfulSite: SiteData } = {
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

  const mockedYoutubeVideo = createMockedYoutubeVideo({
    label: "BMI Group VIDEO LABEL",
    subtitle: null,
    videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
    previewImageSource: "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg",
    dataGTM: {
      id: "cta-click--video-youtube",
      label:
        "https://www.youtube.com/watch?v=TDNEwZbm_Nk-BMI Group VIDEO LABEL",
      action: "Play"
    }
  });

  it("renders correctly with full data", () => {
    renderVideo.mockImplementation(() => mockedYoutubeVideo);
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
