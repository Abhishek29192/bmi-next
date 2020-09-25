import React from "react";
import Footer from "../Footer";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("Footer component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
                slug: "landing-page"
              }
            }
          ]
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
