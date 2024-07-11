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
import { Data as LinkData } from "../../../components/link/types";
import { Data as LinkColumnsSectionData } from "../../../components/LinkColumnsSection";
import { Data as NextBestActionsData } from "../../../components/next-best-actions/NextBestActions";
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
  signupBlock
} from "../__mocks__/simplePage";
import SimplePage, { Data, Props } from "../components/simple-page";
import createShareWidgetData from "../../../__tests__/helpers/ShareWidgetHelper";
import { useAuthType } from "../../../hooks/useAuth";

const mockUseAuth = jest.fn<useAuthType, [useAuthType]>();
jest.mock("../../../hooks/useAuth", () => ({
  __esModule: true,
  default: (args: useAuthType) => mockUseAuth(args)
}));

const loginMock = jest.fn();
const logoutMock = jest.fn();

jest.mock("../../../auth/service", () => ({
  __esModule: true,
  default: {
    login: () => loginMock(),
    logout: () => logoutMock()
  }
}));

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
    __typename: "SimplePage",
    leadBlock: leadBlockData as LeadBlockSectionData,
    shareWidget: createShareWidgetData({
      copy: true,
      linkedin: true,
      pinterest: true
    }),
    sections: sections,
    nextBestActions: nextBestActions as NextBestActionsData,
    exploreBar: exploreBarData as unknown as ExploreBarData,
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
    featuredMedia: featuredMedia,
    isSimplePageProtected: true
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
    mockUseAuth.mockReturnValue({
      isLoggedIn: true, // Simulate user is logged in
      isLoading: false,
      profile: {
        at_hash: "",
        aud: "",
        email: "",
        email_verified: false,
        "https://intouch/first_name": "",
        "https://intouch/intouch_market_code": "",
        "https://intouch/intouch_role": "",
        "https://intouch/last_name": "",
        exp: 0,
        iat: 0,
        iss: "",
        name: "",
        nickname: "",
        nonce: "",
        picture: "",
        sid: "",
        sub: "",
        updated_at: ""
      }
    });

    const { container } = renderWithStylesAndLocationProvider(
      data,
      pageContext
    );
    expect(container).toMatchSnapshot();
  });

  it("will not render when not logged in, loading, and protected", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
      profile: undefined
    });
    const { container } = renderWithStylesAndLocationProvider(
      data,
      pageContext
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders correctly when heroType is Spotlight", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
      profile: {
        at_hash: "",
        aud: "",
        email: "",
        email_verified: false,
        "https://intouch/first_name": "",
        "https://intouch/intouch_market_code": "",
        "https://intouch/intouch_role": "",
        "https://intouch/last_name": "",
        exp: 0,
        iat: 0,
        iss: "",
        name: "",
        nickname: "",
        nonce: "",
        picture: "",
        sid: "",
        sub: "",
        updated_at: ""
      }
    });
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

  it("logs in when page is protected", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
      profile: undefined
    });
    const customData = {
      ...data,
      contentfulSimplePage: {
        ...data.contentfulSimplePage,
        isSimplePageProtected: true
      }
    };
    renderWithStylesAndLocationProvider(customData, pageContext);

    expect(loginMock).toHaveBeenCalled();
  });

  it("does not log in when not protected", () => {
    jest.useFakeTimers();
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
      profile: {
        at_hash: "",
        aud: "",
        email: "",
        email_verified: false,
        "https://intouch/first_name": "",
        "https://intouch/intouch_market_code": "",
        "https://intouch/intouch_role": "",
        "https://intouch/last_name": "",
        exp: 0,
        iat: 0,
        iss: "",
        name: "",
        nickname: "",
        nonce: "",
        picture: "",
        sid: "",
        sub: "",
        updated_at: ""
      }
    });
    const customData = {
      ...data,
      contentfulSimplePage: {
        ...data.contentfulSimplePage,
        isSimplePageProtected: false
      }
    };
    renderWithStylesAndLocationProvider(customData, pageContext);
    expect(loginMock).toHaveBeenCalled();
  });
});
