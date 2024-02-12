import { RegionCode } from "@bmi-digital/components/language-selection";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import { render } from "@testing-library/react";
import React from "react";
import { DataTypeEnum, NavigationData } from "../Link";
import Page, { Data } from "../Page";
import { Data as SiteData } from "../Site";

jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isLoginEnabled: true
  })
}));
const mockNavigation: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main navigation",
  link: null,
  links: [
    {
      __typename: "ContentfulLink",
      id: "string",
      label: "string",
      icon: null,
      isLabelHidden: false,
      url: "link-to-page",
      linkedPage: null,
      type: DataTypeEnum.External,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const mockNestedNavigation: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main navigation",
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
    },
    {
      __typename: "ContentfulLink",
      id: "string",
      label: "string",
      icon: null,
      isLabelHidden: false,
      url: "link-to-page",
      linkedPage: null,
      type: DataTypeEnum.External,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const siteData: SiteData = {
  node_locale: "en-US",
  homePage: {
    title: "Home page title"
  },
  countryCode: "uk",
  footerMainNavigation: mockNavigation,
  footerSecondaryNavigation: mockNavigation,
  menuNavigation: mockNestedNavigation,
  menuUtilities: mockNavigation,
  resources: null,
  pitchedRoofCalculatorConfig: null,
  visualiserHouseTypes: [],
  regions: [
    {
      label: "Europe",
      regionCode: RegionCode.Europe,
      menu: [
        { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
        { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
        { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
      ]
    }
  ],
  accountPage: null
};

const pageData: Data = {
  breadcrumbs: null,
  signupBlock: null,
  seo: null,
  path: "page/"
};

describe("Page component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <Page title="Lorem ipsum" pageData={pageData} siteData={siteData}>
            Lorem ipsum
          </Page>
        </LocationProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("og:image renders", () => {
    render(
      <ThemeProvider>
        <LocationProvider>
          <Page
            title="Lorem ipsum"
            pageData={pageData}
            siteData={siteData}
            ogImageUrl="https://example.com/image.png"
          >
            Lorem ipsum
          </Page>
        </LocationProvider>
      </ThemeProvider>
    );
    expect(
      // eslint-disable-next-line testing-library/no-node-access -- head components can't be found with screen
      document.querySelector("[data-testid='meta-og-image']")
    ).toHaveAttribute("content", "https://example.com/image.png");
  });

  it("og:image converts webp to jpeg", () => {
    render(
      <ThemeProvider>
        <LocationProvider>
          <Page
            title="Lorem ipsum"
            pageData={pageData}
            siteData={siteData}
            ogImageUrl="//images.ctfassets.net/example.webp"
          >
            Lorem ipsum
          </Page>
        </LocationProvider>
      </ThemeProvider>
    );

    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access -- head components can't be found with screen
        .querySelector("[data-testid='meta-og-image']")!
        .getAttribute("content")
    ).toContain("fm=jpg");
  });
});
