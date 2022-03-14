import { ThemeProvider } from "@bmi/components";
import { BLOCKS, Document, INLINES } from "@contentful/rich-text-types";
import { render } from "@testing-library/react";
import React from "react";
import { RichText } from "..";

const mockDocument: Document = {
  nodeType: BLOCKS.DOCUMENT,
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [{ nodeType: "text", value: "test text", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_2,
      content: [{ nodeType: "text", value: "Heading 2", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_2,
      content: [
        {
          nodeType: "text",
          value: "[ot-sdk-cookie-policy]",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_3,
      content: [{ nodeType: "text", value: "Heading 3", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_4,
      content: [{ nodeType: "text", value: "Heading 4", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_5,
      content: [{ nodeType: "text", value: "Heading 5", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.HEADING_6,
      content: [{ nodeType: "text", value: "Heading 6", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.EMBEDDED_ASSET,
      content: [],
      data: {
        target: {
          sys: {
            id: "4J9x7mPKBfkbdzNrZnfPsJ",
            type: "Link",
            linkType: "Asset"
          }
        }
      }
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        { nodeType: "text", value: "Paragraph ", marks: [], data: {} },
        {
          nodeType: "text",
          value: "bold ",
          marks: [{ type: "bold" }],
          data: {}
        },
        {
          nodeType: "text",
          value: "italic ",
          marks: [{ type: "italic" }],
          data: {}
        },
        {
          nodeType: "text",
          value: "underline",
          marks: [{ type: "underline" }],
          data: {}
        },
        { nodeType: "text", value: "  ", marks: [], data: {} },
        {
          nodeType: INLINES.HYPERLINK,
          content: [
            { nodeType: "text", value: "External", marks: [], data: {} }
          ],
          data: { uri: "https://google.co.uk" }
        }
      ],
      data: {}
    }
  ],
  data: {}
};

const links: any = {
  __typename: "ContentArticleBodyLinks",
  assets: {
    __typename: "ContentArticleBodyAssets",
    block: [
      {
        __typename: "Asset",
        sys: {
          __typename: "Sys",
          id: "4J9x7mPKBfkbdzNrZnfPsJ"
        },
        url: "https://images.ctfassets.net/opay6t6wwmup/4J9x7mPKBfkbdzNrZnfPsJ/cc06d1a9d917bcc31447b90f18687035/bmilaw.jpg",
        title: "Fancy appartment",
        width: 2372,
        height: 1480,
        description: "Aspirational photo of a modern apartment terrace"
      }
    ]
  }
};

describe("RichText component", () => {
  it("falls back with empty data", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText content={null} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("check existing data from mock", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText content={mockDocument} links={links} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
