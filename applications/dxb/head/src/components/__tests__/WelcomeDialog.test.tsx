import { ThemeProvider } from "@bmi-digital/components";
import { render, waitForElementToBeRemoved } from "@testing-library/react";
import React from "react";
import WelcomeDialog, { Data } from "../WelcomeDialog";

describe("WelcomeDialog component", () => {
  describe("Renders null", () => {
    it("when Title not present", () => {
      const data: Data = {
        welcomeDialogTitle: null,
        welcomeDialogBody: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        welcomeDialogBrands: []
      };

      const wrapper = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      expect(wrapper.queryByText("test rich text")).toBeNull();
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it("when Body not present", () => {
      const data: Data = {
        welcomeDialogTitle: "title",
        welcomeDialogBody: null,
        welcomeDialogBrands: []
      };

      const wrapper = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      expect(wrapper.queryByText("title")).toBeNull();
      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });

  describe("Renders correctly", () => {
    it("When Title and rich text content are present", () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        welcomeDialogBrands: []
      };

      const wrapper = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      const titleElement = wrapper.getByText(data.welcomeDialogTitle);
      expect(titleElement).not.toBeNull();

      const richTextElement = wrapper.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      const closeButton = wrapper.getByLabelText("Close");
      expect(closeButton).not.toBeNull();

      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it("When Title rich text and icons are present", () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        welcomeDialogBrands: ["Icopal", "Monier", "Monarplan"]
      };

      const wrapper = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );
      const titleElement = wrapper.getByText(data.welcomeDialogTitle);
      expect(titleElement).not.toBeNull();

      const richTextElement = wrapper.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      const closeButton = wrapper.getByLabelText("Close");
      expect(closeButton).not.toBeNull();

      // we dont seem to have a way to examine presense of element by tagname!
      // https://preview.npmjs.com/package/@testing-library/jest-dom might have more extensive matchers
      // just want to make sure that the brands are rendered byt checking container element's childrend count
      expect(wrapper.getByTestId("brandsContainer").children.length).toEqual(3);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it("when Dialog is Closed", async () => {
      const data: Data = {
        welcomeDialogTitle: "Dialog Title",
        welcomeDialogBody: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        welcomeDialogBrands: []
      };

      const { getByLabelText, getByText, baseElement } = render(
        <ThemeProvider>
          <WelcomeDialog data={data} />
        </ThemeProvider>
      );

      const closeButton = getByLabelText("Close");

      closeButton.click();
      await waitForElementToBeRemoved(() => getByText("Dialog Title"));

      expect(baseElement).toMatchSnapshot();
    });
  });
});
