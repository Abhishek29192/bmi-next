import ThemeProvider from "@bmi-digital/components/theme-provider";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import IframeSection, { Data } from "../IframeSection";
import createRichText from "../../__tests__/helpers/RichTextHelper";

const useHasOptanonBoxClosed = jest
  .fn()
  .mockReturnValue({ hasAcceptedOptanonCookie: true });
jest.mock("../../utils/useHasOptanonBoxClosed", () => ({
  useHasOptanonBoxClosed: (configuredCookieClasses: string[]) =>
    useHasOptanonBoxClosed(configuredCookieClasses)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("IframeSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "Iframe",
      title: "iFrame Section",
      summary: createRichText({
        json: {
          data: {},
          content: [
            {
              data: {},
              content: [
                { data: {}, marks: [], value: "Summary", nodeType: "text" }
              ],
              nodeType: BLOCKS.PARAGRAPH
            }
          ],
          nodeType: BLOCKS.DOCUMENT
        },
        references: new Map()
      }),
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
    ).toBeInTheDocument();
  });
  describe("when allowCookieClasses are populated", () => {
    describe("and single cookie class is provided", () => {
      it("renders single additional classe", () => {
        const data: Data = {
          __typename: "Iframe",
          title: "iFrame Section",
          summary: createRichText({
            json: {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    { data: {}, marks: [], value: "Summary", nodeType: "text" }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                }
              ],
              nodeType: BLOCKS.DOCUMENT
            },
            references: new Map()
          }),
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
          __typename: "Iframe",
          title: "iFrame Section",
          summary: createRichText({
            json: {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    { data: {}, marks: [], value: "Summary", nodeType: "text" }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                }
              ],
              nodeType: BLOCKS.DOCUMENT
            },
            references: new Map()
          }),
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

  describe("when useHasOptanonBoxClosed returns false", () => {
    it("does not render iframe ", () => {
      useHasOptanonBoxClosed.mockReturnValueOnce({
        hasAcceptedOptanonCookie: false
      });

      const data: Data = {
        __typename: "Iframe",
        title: "iFrame Section",
        summary: createRichText({
          json: {
            data: {},
            content: [
              {
                data: {},
                content: [
                  { data: {}, marks: [], value: "Summary", nodeType: "text" }
                ],
                nodeType: BLOCKS.PARAGRAPH
              }
            ],
            nodeType: BLOCKS.DOCUMENT
          },
          references: new Map()
        }),
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
        screen.getByTestId(`iframe-section-${replaceSpaces(data.title)}`)
      ).toBeInTheDocument();
      expect(screen.getByText(data.title!)).toBeInTheDocument();
      expect(screen.getByText("Summary")).not.toBeNull();
      expect(
        screen.queryByTestId(
          `iframe-section-${replaceSpaces(data.title)}-iframe`
        )
      ).not.toBeInTheDocument();
    });
  });
});
