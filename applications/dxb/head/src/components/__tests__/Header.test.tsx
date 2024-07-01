import { RegionCode } from "@bmi-digital/components/language-selection";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { microCopy } from "@bmi/microcopies";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import createLinkData, {
  createExternalLinkData
} from "../../__tests__/helpers/LinkHelper";
import BasketContext from "../../contexts/SampleBasketContext";
import Header from "../Header";
import { fallbackGetMicroCopy as getMicroCopy } from "../MicroCopy";
import { DataTypeEnum, NavigationData } from "../link/types";
import createAuth0IdTokenPayload from "../../templates/myAccountPage/__tests__/helpers/Auth0IdTokenPayloadHelper";
import { SiteContextProvider } from "../Site";
import createPageInfoData from "../../__tests__/helpers/PageInfoHelper";
import { getMockSiteContext } from "./utils/SiteContextProvider";
import type { Data as PromoData } from "../Promo";
import type { Data as PageInfoData } from "../PageInfo";
import type { useAuthType } from "../../hooks/useAuth";

let isGatsbyDisabledElasticSearch: boolean;
let isSampleOrderingEnabled: boolean;
let isLoginEnabled: boolean;

const useIsClientMock = jest.fn();

jest.mock("@bmi-digital/components", () => ({
  ...jest.requireActual("@bmi-digital/components"),
  useIsClient: () => useIsClientMock()
}));

jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isGatsbyDisabledElasticSearch,
    isSampleOrderingEnabled,
    isLoginEnabled
  })
}));

const mockUseAuth = jest.fn<useAuthType, [useAuthType]>();
jest.mock("../../hooks/useAuth", () => ({
  __esModule: true,
  default: (args: useAuthType) => mockUseAuth(args)
}));

const loginMock = jest.fn();
const logoutMock = jest.fn();
jest.mock("../../auth/service", () => ({
  __esModule: true,
  default: {
    login: () => loginMock(),
    logout: () => logoutMock()
  }
}));

beforeEach(() => {
  jest.useFakeTimers();
  isGatsbyDisabledElasticSearch = false;
  isSampleOrderingEnabled = true;
  isLoginEnabled = true;
  useIsClientMock.mockReturnValue({ isClient: true });
  mockUseAuth.mockReturnValue({
    isLoggedIn: false,
    isLoading: false,
    profile: undefined
  });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const regions = [
  {
    label: "Europe",
    regionCode: RegionCode.Europe,
    menu: [
      { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
      { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
      { code: "gb", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
    ]
  }
];

const card1: PromoData = {
  __typename: "ContentfulPromo",
  id: "card1",
  name: "cardTitle1",
  title: "cardTitle1",
  subtitle: null,
  body: null,
  brandLogo: null,
  tags: null,
  featuredMedia: createImageData(),
  cta: createLinkData(),
  featuredVideo: null,
  backgroundColor: null
};
const card2: PageInfoData = createPageInfoData({
  id: "card2",
  path: "/gb/card2"
});

const promos: NavigationData["promos"] = [card1, card2];

const navigationData: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main",
  link: null,
  links: [
    {
      __typename: "ContentfulNavigation",
      label: "Get in touch",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "+44 (0) 1234567890",
          url: "tel:+4401234567890",
          isLabelHidden: null,
          icon: "Phone",
          linkedPage: null,
          type: DataTypeEnum.External,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ]
    },
    {
      __typename: "ContentfulNavigationItem",
      type: "Separator",
      value: "separator"
    },
    {
      __typename: "ContentfulNavigation",
      label: "About BMI",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "Our story",
          url: null,
          isLabelHidden: null,
          icon: null,
          linkedPage: {
            path: "landing-page"
          },
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        },
        {
          __typename: "ContentfulLink",
          id: "",
          label: "Another Page",
          url: null,
          isLabelHidden: null,
          icon: null,
          linkedPage: {
            path: "another-page"
          },
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ],
      promos
    },
    createExternalLinkData({
      icon: null,
      id: "inTouchLink",
      label: "inTouchLink",
      url: "https://www.external.co.uk"
    })
  ]
};

const utilitiesData: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "About BMI",
  link: null,
  links: [
    {
      __typename: "ContentfulLink",
      id: "",
      label: "Our story",
      url: null,
      isLabelHidden: null,
      icon: null,
      linkedPage: {
        path: "landing-page"
      },
      type: DataTypeEnum.Internal,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const sampleBasketLinkInfo: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "sample-basket",
  path: "sample-basket/",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: null,
  rawDate: null,
  tags: null,
  sections: [
    {
      title: "Basket title"
    }
  ]
};

const sampleBasketProducts: any = {
  basketState: {
    products: [
      {
        name: "test product",
        code: "S",
        path: "s",
        image: "S",
        classifications: []
      }
    ]
  }
};

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders the promos correctly", async () => {
    render(
      <ThemeProvider>
        <Header
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    const aboutBmiMenuButton = screen.getByLabelText("About BMI");
    fireEvent.click(aboutBmiMenuButton);

    expect(
      screen.getByRole("img", { name: card1.featuredMedia!.altText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: card1.title! })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: card1.cta!.label })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: card2.title! })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: card2.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: `MC: ${microCopy.PAGE_LINK_LABEL}` })
    ).toBeInTheDocument();
  });

  it("renders correctly when flag doesn't exist", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="grp"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("toggles search", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    const searchLabel = getMicroCopy(microCopy.SEARCH_LABEL);

    const searchButton = screen.getByLabelText(searchLabel);

    expect(searchButton).toBeTruthy();

    fireEvent.click(searchButton);
    jest.runAllTimers();

    expect(container).toMatchSnapshot();
  });

  it("hides search button if disableSearch is true", () => {
    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
          disableSearch={true}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("search-submit-button")
    ).not.toBeInTheDocument();
  });

  it("shows sample basket icon", () => {
    const { container } = render(
      <ThemeProvider>
        <BasketContext.Provider value={sampleBasketProducts}>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            sampleBasketLink={sampleBasketLinkInfo}
            maximumSamples={3}
          />
        </BasketContext.Provider>
      </ThemeProvider>
    );

    const basketButton = screen.queryByLabelText(
      getMicroCopy(microCopy.BASKET_LABEL)
    );

    expect(basketButton).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("shows sample basket dialog on clicking on basket and hide it clicking on close", async () => {
    render(
      <BasketContext.Provider value={sampleBasketProducts}>
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </BasketContext.Provider>
    );
    expect(screen.getByTestId("shopping-cart-dialog")).not.toBeVisible();
    const basketButton = screen.getByLabelText(
      getMicroCopy(microCopy.BASKET_LABEL)
    );
    fireEvent.click(basketButton);
    jest.runAllTimers();
    expect(screen.getByTestId("shopping-cart-dialog")).toBeVisible();

    fireEvent.click(
      screen.getByLabelText(getMicroCopy(microCopy.DIALOG_CLOSE))
    );
    jest.runAllTimers();
    await waitFor(() =>
      expect(screen.getByTestId("shopping-cart-dialog")).not.toBeVisible()
    );
  });

  it("shows login btn", () => {
    render(
      <ThemeProvider>
        <BasketContext.Provider value={sampleBasketProducts}>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            sampleBasketLink={sampleBasketLinkInfo}
            maximumSamples={3}
          />
        </BasketContext.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText("MC: login.label.btn")).toBeInTheDocument();
  });

  it("applies a gtm attribute to the navigation tab component when a Contentful Link type", () => {
    render(
      <ThemeProvider>
        <Header
          countryCode="en"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("header-navigation-tab-2")).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "nav-main-menu",
        label: "inTouchLink",
        action: "https://www.external.co.uk"
      })
    );
  });

  it("applies a gtm attribute to the navigation tab component when a Contentful Navigation type", () => {
    render(
      <ThemeProvider>
        <Header
          countryCode="en"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("header-navigation-tab-0")).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "nav-main-menu",
        label: "Get in touch"
      })
    );
  });

  it("applies a gtm attribute to the search button, using the SEARCH LABEL microCopy as the GTM label", () => {
    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    const searchLabel = getMicroCopy(microCopy.SEARCH_LABEL);

    const searchButton = screen.getByLabelText(searchLabel);

    expect(searchButton).toBeTruthy();

    fireEvent.click(searchButton);

    expect(screen.getByTestId("search-submit-button")).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "search1",
        label: "MC: search.label"
      })
    );
  });
});

describe("Intouch link behavior", () => {
  it("generates correct href if link is not intouch link and isClient is true", () => {
    useIsClientMock.mockReturnValue({ isClient: true });

    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
          sampleBasketLink={sampleBasketLinkInfo}
        />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByText("inTouchLink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref = "https://www.external.co.uk";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);
  });

  it("generates correct href if link isintouch link and is isClient is true", () => {
    useIsClientMock.mockReturnValue({ isClient: true });
    const originalEnv = process.env.GATSBY_INTOUCH_ORIGIN;
    process.env.GATSBY_INTOUCH_ORIGIN = "https://www.external.co.uk";

    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
          sampleBasketLink={sampleBasketLinkInfo}
        />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByText("inTouchLink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref =
      "https://www.external.co.uk?prev_page=http%3A%2F%2Flocalhost%2F";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    process.env.GATSBY_INTOUCH_ORIGIN = originalEnv;
  });

  it("generates correct href if link is not intouch link and isClient is false", () => {
    useIsClientMock.mockReturnValue({ isClient: false });

    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
          sampleBasketLink={sampleBasketLinkInfo}
        />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByText("inTouchLink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref = "https://www.external.co.uk";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);
  });
});

describe("Login", () => {
  it("should not render 'Login' button if isLoginEnabled === false", () => {
    isLoginEnabled = false;

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.queryByText("MC: login.label.btn")).not.toBeInTheDocument();
  });

  it("should render 'Login' button if isLoginEnabled === true", () => {
    isLoginEnabled = true;

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.getByText("MC: login.label.btn")).toBeInTheDocument();
  });

  it("should not render 'Login' button if account is not provided", () => {
    isLoginEnabled = false;

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: null
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.queryByText("MC: login.label.btn")).not.toBeInTheDocument();
  });

  it("should not render 'Login' button if a user is logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload(),
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.queryByText("MC: login.label.btn")).not.toBeInTheDocument();
  });

  it("should render 'Login' button if isLoggedIn === true but profile === undefined", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: undefined,
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.getByText("MC: login.label.btn")).toBeInTheDocument();
  });

  it("should render 'Login' button if isLoggedIn === false but profile provided", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      profile: createAuth0IdTokenPayload(),
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.getByText("MC: login.label.btn")).toBeInTheDocument();
  });

  it("should call AuthService.login if a user clicks 'Login' button", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      profile: undefined,
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );

    fireEvent.click(screen.getByText("MC: login.label.btn"));
    expect(loginMock).toHaveBeenCalledTimes(1);
  });

  it("should render 'Logout' and 'My account' buttons if a user is logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload(),
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );
    expect(screen.getByText("MC: logout.label.btn")).toBeInTheDocument();
    expect(screen.getByText("MC: my.account.label")).toBeInTheDocument();
  });

  it("should call AuthService.logout if a user clicks 'Logout' button", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload(),
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );

    fireEvent.click(screen.getByText("MC: logout.label.btn"));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("should render 'My account' button with 'href' attribute", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload(),
      isLoading: false
    });

    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          accountPage: { slug: "account" }
        }}
      >
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="no"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </SiteContextProvider>
    );

    expect(screen.getByText("MC: my.account.label")).toHaveAttribute(
      "href",
      "/no/account/"
    );
  });
});
