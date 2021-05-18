import React from "react";
import { render } from "@testing-library/react";
import { LocationProvider } from "@reach/router";
import { Data as SiteData } from "../Site";
import { NavigationData } from "../Link";
import Page, { Data } from "../Page";

describe("Page component", () => {
  it("renders correctly", () => {
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
          type: "External",
          parameters: null
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
      menuNavigation: mockNavigation,
      menuUtilities: mockNavigation,
      resources: null,
      scriptGOptLoad: null,
      scriptGRecaptchaId: "1234",
      scriptGRecaptchaNet: null
    };

    const pageData: Data = {
      breadcrumbs: null,
      inputBanner: null,
      seo: null
    };

    const { container } = render(
      <LocationProvider>
        <Page title="Lorem ipsum" pageData={pageData} siteData={siteData}>
          Lorem ipsum
        </Page>
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
