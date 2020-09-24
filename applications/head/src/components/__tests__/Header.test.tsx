import React from "react";
import Header from "../Header";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Header
        navigationData={{
          label: "Main",
          links: [
            {
              label: "Get in touch",
              links: [
                {
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
              label: "About BMI",
              links: [
                {
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
        utilitiesData={{
          label: "About BMI",
          links: [
            {
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
