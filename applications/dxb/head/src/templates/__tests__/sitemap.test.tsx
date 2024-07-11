import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React from "react";
import { DataTypeEnum } from "../../components/link/types";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import Sitemap from "../sitemap";
import type {
  Data as LinkData,
  NavigationData
} from "../../components/link/types";
import type { Data as SiteData } from "../../components/Site";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("Sitemap", () => {
  const link: LinkData = {
    __typename: "Link",
    id: "linkId",
    label: "linkLabel",
    icon: null,
    isLabelHidden: null,
    url: "https://www.external.co.uk",
    linkedPage: null,
    type: DataTypeEnum.External,
    parameters: null,
    dialogContent: null,
    hubSpotCTAID: null,
    queryParams: null
  };
  const footerMainNavigation: NavigationData = {
    __typename: "Navigation",
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
    __typename: "Navigation",
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
    __typename: "Navigation",
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
    __typename: "Navigation",
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getAllByTestId("sitemap-section")).toHaveLength(4);
    expect(screen.getByText(footerMainNavigation.label!)).toBeTruthy();
    expect(screen.getByText(footerSecondaryNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuUtilities.label!)).toBeTruthy();
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getAllByTestId("sitemap-section")).toHaveLength(3);
    expect(screen.getByText(footerMainNavigation.label!)).toBeTruthy();
    expect(screen.queryByText(footerSecondaryNavigation.label!)).toBeFalsy();
    expect(screen.getByText(menuNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuUtilities.label!)).toBeTruthy();
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getAllByTestId("sitemap-section")).toHaveLength(3);
    expect(screen.getByText(footerMainNavigation.label!)).toBeTruthy();
    expect(screen.getByText(footerSecondaryNavigation.label!)).toBeTruthy();
    expect(screen.queryByText(menuNavigation.label!)).toBeFalsy();
    expect(screen.getByText(menuUtilities.label!)).toBeTruthy();
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getAllByTestId("sitemap-section")).toHaveLength(3);
    expect(screen.getByText(footerMainNavigation.label!)).toBeTruthy();
    expect(screen.getByText(footerSecondaryNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuNavigation.label!)).toBeTruthy();
    expect(screen.queryByText(menuUtilities.label!)).toBeFalsy();
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Sitemap data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getAllByTestId("sitemap-section")).toHaveLength(4);
    expect(screen.getByText(footerMainNavigation.label!)).toBeTruthy();
    expect(screen.getByText(footerSecondaryNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuNavigation.label!)).toBeTruthy();
    expect(screen.getByText(menuUtilities.label!)).toBeTruthy();
  });
});
