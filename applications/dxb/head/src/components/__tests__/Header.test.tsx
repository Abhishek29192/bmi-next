import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import Header from "../Header";

beforeAll(() => {
  mockConsole();
});

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Header
        activeLabel="Main"
        countryCode="gb"
        navigationData={{
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
                  type: "External",
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
                  type: "Internal",
                  parameters: null,
                  dialogContent: null,
                  hubSpotCTAID: null
                }
              ]
            }
          ]
        }}
        utilitiesData={{
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
              type: "Internal",
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null
            }
          ]
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
