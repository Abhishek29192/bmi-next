import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import Footer from "../Footer";

import { SiteContextProvider } from "../Site";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
      value={{
        node_locale: "en-UK",
        homePage: { title: "Home Page" },
        getMicroCopy: (path) => path,
        countryCode: "uk",
        reCaptchaKey: "1234",
        reCaptchaNet: false
      }}
    >
      {children}
    </SiteContextProvider>
  );
};

beforeAll(() => {
  mockConsole();
});

describe("Footer component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MockSiteContext>
        <Footer
          mainNavigation={{
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
                    type: null,
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
                    type: null,
                    parameters: null,
                    dialogContent: null,
                    hubSpotCTAID: null
                  }
                ]
              }
            ]
          }}
          secondaryNavigation={{
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
                type: null,
                parameters: null,
                dialogContent: null,
                hubSpotCTAID: null
              }
            ]
          }}
        />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });
});
