import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { createMockSiteData } from "../../../test/mockSiteData";
import IEDialog from "../index";

const richTextRaw = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "heading-3",
      content: [
        {
          nodeType: "text",
          value: "Rich Text heading 3",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "Rich Text paragraph text",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

const data = { contentfulSite: createMockSiteData() };

data.contentfulSite.resources = {
  ...data.contentfulSite.resources,
  ieDialogTitle: "IE Dialog Title",
  ieDialogBody: { raw: JSON.stringify(richTextRaw), references: null },
  ieDialogActionLabel: "Label",
  ieDialogActionLink: "http://localhost"
};

describe("IEDialog component", () => {
  it("renders correctly", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <IEDialog data={data} />
      </ThemeProvider>
    );

    expect(baseElement).toMatchSnapshot();
  });
});
