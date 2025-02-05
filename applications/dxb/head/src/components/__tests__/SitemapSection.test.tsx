import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import SitemapSection from "../SitemapSection";
import { DataTypeEnum } from "../link/types";
import type { Data as LinkData, NavigationData } from "../link/types";

describe("SitemapSection component", () => {
  it("renders correctly", () => {
    const data: NavigationData = {
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
              type: DataTypeEnum.External,
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
    };

    const { container } = render(
      <ThemeProvider>
        <SitemapSection data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly 2 levels deep", () => {
    const data: NavigationData = {
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
              type: DataTypeEnum.External,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null,
              queryParams: null
            },
            {
              __typename: "Navigation",
              label: "About BMI 2",
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
                },
                {
                  __typename: "Navigation",
                  label: "About BMI 2",
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
    };

    const { container } = render(
      <ThemeProvider>
        <SitemapSection data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with header links", () => {
    const headerLink = {
      __typename: "Link",
      id: "testLink",
      label: "Get in touch",
      url: "/test",
      linkedPage: null,
      type: DataTypeEnum.External
    } as LinkData;

    const data: NavigationData = {
      __typename: "Navigation",
      label: "Main",
      link: null,
      links: [
        {
          __typename: "Navigation",
          label: "Get in touch",
          link: headerLink,
          links: [
            {
              __typename: "Link",
              id: "",
              label: "+44 (0) 1234567890",
              url: "tel:+4401234567890",
              isLabelHidden: null,
              icon: "Phone",
              linkedPage: null,
              type: DataTypeEnum.External,
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
    };

    render(
      <ThemeProvider>
        <SitemapSection data={data} />
      </ThemeProvider>
    );
    const linkResult = screen.getAllByTestId("sitemap-link");
    expect(linkResult).toHaveLength(2);
  });

  it("renders correctly if incomplete", () => {
    const data = {
      __typename: "Navigation"
    } as NavigationData;

    const { container } = render(
      <ThemeProvider>
        <SitemapSection data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
