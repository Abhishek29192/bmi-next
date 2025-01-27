import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import Footer from "../Footer";
import { SiteContextProvider } from "../Site";
import { DataTypeEnum } from "../link/types";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("uk", "en-UK"),
          homePage: { title: "Home Page" },
          getMicroCopy: (path) => path,
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        {children}
      </SiteContextProvider>
    </ThemeProvider>
  );
};

describe("Footer component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MockSiteContext>
        <Footer
          mainNavigation={{
            __typename: "Navigation",
            label: "Main",
            link: null,
            links: [
              {
                __typename: "Navigation",
                label: "Get in touch",
                link: null,
                links: [
                  {
                    __typename: "Link",
                    id: "",
                    label: "+44 (0) 1234567890",
                    url: "tel:+4401234567890",
                    isLabelHidden: null,
                    icon: "Phone",
                    linkedPage: null,
                    type: DataTypeEnum.Internal,
                    parameters: null,
                    dialogContent: null,
                    hubSpotCTAID: null,
                    queryParams: null
                  }
                ]
              },
              {
                __typename: "Navigation",
                label: "About BMI",
                link: null,
                links: [
                  {
                    __typename: "Link",
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
                    hubSpotCTAID: null,
                    queryParams: null
                  }
                ]
              }
            ]
          }}
          secondaryNavigation={{
            __typename: "Navigation",
            label: "About BMI",
            link: null,
            links: [
              {
                __typename: "Link",
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
                hubSpotCTAID: null,
                queryParams: null
              }
            ]
          }}
        />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders without brand logo Icon if it is presented in link", () => {
    const { container } = render(
      <MockSiteContext>
        <Footer
          mainNavigation={{
            __typename: "Navigation",
            label: "Main",
            link: null,
            links: [
              {
                __typename: "Navigation",
                label: "Get in touch",
                link: null,
                links: [
                  {
                    __typename: "Link",
                    id: "",
                    label: "+44 (0) 1234567890",
                    url: "tel:+4401234567890",
                    isLabelHidden: null,
                    icon: "Phone",
                    linkedPage: null,
                    type: DataTypeEnum.Internal,
                    parameters: null,
                    dialogContent: null,
                    hubSpotCTAID: null,
                    queryParams: null
                  }
                ]
              },
              {
                __typename: "Navigation",
                label: "About BMI",
                link: null,
                links: [
                  {
                    __typename: "Link",
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
                    hubSpotCTAID: null,
                    queryParams: null
                  }
                ]
              }
            ]
          }}
          secondaryNavigation={{
            __typename: "Navigation",
            label: "Brands",
            link: null,
            links: [
              {
                __typename: "Link",
                id: "",
                label: "Icopal brand",
                url: null,
                isLabelHidden: null,
                icon: "Icopal",
                linkedPage: {
                  path: "landing-page"
                },
                type: DataTypeEnum.Internal,
                parameters: null,
                dialogContent: null,
                hubSpotCTAID: null,
                queryParams: null
              }
            ]
          }}
        />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });
});
