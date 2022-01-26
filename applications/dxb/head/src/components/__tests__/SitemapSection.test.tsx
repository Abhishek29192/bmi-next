import React from "react";
import { render } from "@testing-library/react";
import SitemapSection from "../SitemapSection";
import { DataTypeEnum, NavigationData } from "../Link";

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

  it("renders correctly if incomplete", () => {
    const data = {
      __typename: "ContentfulNavigation"
    } as NavigationData;

    const { container } = render(<SitemapSection data={data} />);
    expect(container).toMatchSnapshot();
  });
});
