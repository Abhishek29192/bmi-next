import React from "react";
import { Data as SiteData } from "../Site";
import { NavigationData } from "../Link";
import Page, { Data } from "../Page";
import { render } from "@testing-library/react";

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
          linkedPage: null
        }
      ]
    };

    const siteData: SiteData = {
      node_locale: "en-US",
      homePage: {
        title: "Home page title"
      },
      signUpTitle: "Title",
      signUpDescription: {
        signUpDescription: "Description"
      },
      signUpInputLabel: "Label",
      signUpCallToAction: "Call to action",
      countryCode: "uk",
      footerMainNavigation: mockNavigation,
      footerSecondaryNavigation: mockNavigation,
      menuNavigation: mockNavigation,
      menuUtilities: mockNavigation,
      resources: []
    };

    const pageData: Data = {
      showSignUpBanner: false,
      slug: "page-title"
    };

    const { container } = render(
      <Page title="Lorem ipsum" pageData={pageData} siteData={siteData}>
        Lorem ipsum
      </Page>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
