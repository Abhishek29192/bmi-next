import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import WelcomeDialog, { Data } from "../WelcomeDialog";
import createRichText from "../../__tests__/helpers/RichTextHelper";

describe("WelcomeDialog component", () => {
  describe("Renders null", () => {
    it("when Title not present", () => {
      const data: Data = {
        welcomeDialogTitle: null,
        welcomeDialogBody: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                  {
                    nodeType: "text",
                    value: "test rich text",
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        }),
        welcomeDialogBrands: []
      };

      const { baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      expect(screen.queryByText("test rich text")).toBeNull();
      expect(baseElement).toMatchSnapshot();
    });
    it("when Body not present", () => {
      const data: Data = {
        welcomeDialogTitle: "title",
        welcomeDialogBody: null,
        welcomeDialogBrands: []
      };

      const { baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      expect(screen.queryByText("title")).toBeNull();
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe("Renders correctly", () => {
    it("When Title and rich text content are present", () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                  {
                    nodeType: "text",
                    value: "test rich text",
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        }),
        welcomeDialogBrands: []
      };

      const { baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.welcomeDialogTitle!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });
    it("When Title rich text and icons are present", () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                  {
                    nodeType: "text",
                    value: "test rich text",
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        }),
        welcomeDialogBrands: ["Icopal", "Monier", "Monarplan"]
      };

      const { baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.welcomeDialogTitle!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).not.toBeNull();

      data.welcomeDialogBrands!.forEach((brandName) =>
        expect(
          screen.getByTestId(`welcome-brand-${brandName}`)
        ).toBeInTheDocument()
      );
      expect(baseElement).toMatchSnapshot();
    });
    it("when Dialog is Closed", async () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                  {
                    nodeType: "text",
                    value: "test rich text",
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        }),
        welcomeDialogBrands: []
      };

      const { baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );

      const closeButton = screen.getByLabelText("Close");

      fireEvent.click(closeButton);
      await waitForElementToBeRemoved(() => screen.queryByText("Dialog Title"));

      expect(baseElement).toMatchSnapshot();
    });
  });
});
