import React from "react";
import { render } from "@testing-library/react";
import SitemapSection from "../SitemapSection";
import { DataTypeEnum, NavigationData, Data as LinkData } from "../Link";

describe("SitemapSection component", () => {
  it("renders correctly", () => {
    const data: NavigationData = {
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
        }
      ]
    };

    const { container } = render(<SitemapSection data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly 2 levels deep", () => {
    const data: NavigationData = {
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
            },
            {
              __typename: "ContentfulNavigation",
              label: "About BMI 2",
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
                  __typename: "ContentfulNavigation",
                  label: "About BMI 2",
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
                }
              ]
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
        }
      ]
    };

    const { container } = render(<SitemapSection data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with header links", () => {
    const headerLink = {
      __typename: "ContentfulLink",
      id: "testLink",
      label: "Get in touch",
      url: "/test",
      linkedPage: null,
      type: DataTypeEnum.External
    } as LinkData;

    const data: NavigationData = {
      __typename: "ContentfulNavigation",
      label: "Main",
      link: null,
      links: [
        {
          __typename: "ContentfulNavigation",
          label: "Get in touch",
          link: headerLink,
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
        }
      ]
    };

    const { container } = render(<SitemapSection data={data} />);
    const linkResult = container.querySelectorAll("a");
    expect(linkResult).toHaveLength(3);
  });

  it("renders correctly if incomplete", () => {
    const data = {
      __typename: "ContentfulNavigation"
    } as NavigationData;

    const { container } = render(<SitemapSection data={data} />);
    expect(container).toMatchSnapshot();
  });
});
