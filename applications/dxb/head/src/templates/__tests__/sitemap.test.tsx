import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import {
  Data as LinkData,
  DataTypeEnum,
  NavigationData
} from "../../components/Link";
import { Data as SiteData } from "../../components/Site";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import Sitemap from "../sitemap";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("Sitemap", () => {
  const link: LinkData = {
    __typename: "ContentfulLink",
    id: "linkId",
    label: "linkLabel",
    icon: null,
    isLabelHidden: null,
    url: "https://www.external.co.uk",
    linkedPage: null,
    type: DataTypeEnum.External,
    parameters: null,
    dialogContent: null,
    hubSpotCTAID: null
  };
  const footerMainNavigation: NavigationData = {
    __typename: "ContentfulNavigation",
    label: "footerMainNavigationLabel",
    link,
    promos: null,
    links: [
      {
        ...link,
        url: "footerMainNavigationLink",
        id: "footerMainNavigationLinkId",
        label: "footerMainNavigationLinkLabel"
      }
    ]
  };
  const footerSecondaryNavigation: NavigationData = {
    __typename: "ContentfulNavigation",
    label: "footerSecondaryNavigationLabel",
    link,
    promos: null,
    links: [
      {
        ...link,
        url: "footerSecondaryNavigationLink",
        id: "footerSecondaryNavigationLinkId",
        label: "footerSecondaryNavigationLinkLabel"
      }
    ]
  };
  const menuNavigation: NavigationData = {
    __typename: "ContentfulNavigation",
    label: "menuNavigationLabel",
    link,
    promos: null,
    links: [
      {
        ...link,
        url: "menuNavigationLink",
        id: "menuNavigationLinkId",
        label: "menuNavigationLinkLabel"
      }
    ]
  };
  const menuUtilities: NavigationData = {
    __typename: "ContentfulNavigation",
    label: "menuUtilitiesLabel",
    link,
    promos: null,
    links: [
      {
        ...link,
        url: "menuUtilitiesLink",
        id: "menuUtilitiesLinkId",
        label: "menuUtilitiesLinkLabel"
      }
    ]
  };
  const mockSiteData = createMockSiteData();

  it("renders correctly", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation,
        footerSecondaryNavigation,
        menuNavigation,
        menuUtilities
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      4
    );
    expect(queryByText(footerMainNavigation.label)).toBeTruthy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeTruthy();
    expect(queryByText(menuNavigation.label)).toBeTruthy();
    expect(queryByText(menuUtilities.label)).toBeTruthy();
  });

  it("renders correctly when footerMainNavigation is falsy", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation: null,
        footerSecondaryNavigation,
        menuNavigation,
        menuUtilities
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      3
    );
    expect(queryByText(footerMainNavigation.label)).toBeFalsy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeTruthy();
    expect(queryByText(menuNavigation.label)).toBeTruthy();
    expect(queryByText(menuUtilities.label)).toBeTruthy();
  });

  it("renders correctly when footerSecondaryNavigation is falsy", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation,
        footerSecondaryNavigation: null,
        menuNavigation,
        menuUtilities
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      3
    );
    expect(queryByText(footerMainNavigation.label)).toBeTruthy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeFalsy();
    expect(queryByText(menuNavigation.label)).toBeTruthy();
    expect(queryByText(menuUtilities.label)).toBeTruthy();
  });

  it("renders correctly when menuNavigation is falsy", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation,
        footerSecondaryNavigation,
        menuNavigation: null,
        menuUtilities
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(0);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      3
    );
    expect(queryByText(footerMainNavigation.label)).toBeTruthy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeTruthy();
    expect(queryByText(menuNavigation.label)).toBeFalsy();
    expect(queryByText(menuUtilities.label)).toBeTruthy();
  });

  it("renders correctly when menuUtilities is falsy", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation,
        footerSecondaryNavigation,
        menuNavigation,
        menuUtilities: null
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(0);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      3
    );
    expect(queryByText(footerMainNavigation.label)).toBeTruthy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeTruthy();
    expect(queryByText(menuNavigation.label)).toBeTruthy();
    expect(queryByText(menuUtilities.label)).toBeFalsy();
  });

  it("cover test for pageContext optional chaining", () => {
    const data: { contentfulSite: SiteData } = {
      contentfulSite: {
        ...mockSiteData,
        footerMainNavigation,
        footerSecondaryNavigation,
        menuNavigation,
        menuUtilities
      }
    };
    const { container, getByTestId, queryByText } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelectorAll("[class*='Section-root']").length).toBe(
      4
    );
    expect(queryByText(footerMainNavigation.label)).toBeTruthy();
    expect(queryByText(footerSecondaryNavigation.label)).toBeTruthy();
    expect(queryByText(menuNavigation.label)).toBeTruthy();
    expect(queryByText(menuUtilities.label)).toBeTruthy();
  });
});
