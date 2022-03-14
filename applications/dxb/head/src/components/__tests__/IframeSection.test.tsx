import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
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
      container.getElementsByClassName("optanon-category-C0002-C0004").length
    ).toEqual(0);
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

        const { container } = render(<IframeSection data={data} />);
        expect(
          container.getElementsByClassName("optanon-category-C0007").length
        ).toEqual(1);
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

        const { container } = render(<IframeSection data={data} />);
        expect(
          container.getElementsByClassName("optanon-category-C0002-C0004")
            .length
        ).toEqual(1);
      });
    });
  });
});
