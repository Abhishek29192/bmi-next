import React from "react";
import { render } from "@testing-library/react";
import SitemapSection from "../SitemapSection";
import { NavigationData } from "../Link";

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
              linkedPage: null
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
                slug: "landing-page"
              }
            }
          ]
        }
      ]
    };

    const { container } = render(<SitemapSection data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
