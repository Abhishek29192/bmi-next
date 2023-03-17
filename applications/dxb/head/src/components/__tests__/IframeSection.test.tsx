import { replaceSpaces, ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import IframeSection, { Data } from "../IframeSection";

describe("IframeSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulIframe",
      title: "iFrame Section",
      summary: {
        raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Summary","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
        references: []
      },
      url: "https://google.co.uk",
      height: "450px",
      allowCookieClasses: null
    };

    const { container } = render(
      <ThemeProvider>
        <IframeSection data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    expect(
      screen.getByTestId(`iframe-section-${replaceSpaces(data.title)}-iframe`)
    ).toHaveAttribute("class", "iFrame");
  });
  describe("when allowCookieClasses are populated", () => {
    describe("and single cookie class is provided", () => {
      it("renders single additional classe", () => {
        const data: Data = {
          __typename: "ContentfulIframe",
          title: "iFrame Section",
          summary: {
            raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Summary","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
            references: []
          },
          url: "https://google.co.uk",
          height: "450px",
          allowCookieClasses: ["Performance"]
        };

        render(
          <ThemeProvider>
            <IframeSection data={data} />
          </ThemeProvider>
        );
        expect(
          screen.getByTestId(
            `iframe-section-${replaceSpaces(data.title)}-iframe`
          )
        ).toHaveClass("optanon-category-C0007");
      });
    });

    describe("and multiple cookie classes are provided", () => {
      it("renders with multiple classes", () => {
        const data: Data = {
          __typename: "ContentfulIframe",
          title: "iFrame Section",
          summary: {
            raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Summary","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
            references: []
          },
          url: "https://google.co.uk",
          height: "450px",
          allowCookieClasses: ["Analytics", "Targeting"]
        };

        render(
          <ThemeProvider>
            <IframeSection data={data} />
          </ThemeProvider>
        );
        expect(
          screen.getByTestId(
            `iframe-section-${replaceSpaces(data.title)}-iframe`
          )
        ).toHaveClass("optanon-category-C0002-C0004");
      });
    });
  });
});
