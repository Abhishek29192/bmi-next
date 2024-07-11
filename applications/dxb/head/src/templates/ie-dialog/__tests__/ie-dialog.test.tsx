import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { createMockSiteData } from "../../../test/mockSiteData";
import IEDialog from "../index";
import createRichText from "../../../__tests__/helpers/RichTextHelper";
import type { RichTextData } from "../../../components/RichText";

const richTextRaw: RichTextData["json"] = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.HEADING_3,
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
      nodeType: BLOCKS.PARAGRAPH,
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
  ieDialogBody: createRichText({ json: richTextRaw }),
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
