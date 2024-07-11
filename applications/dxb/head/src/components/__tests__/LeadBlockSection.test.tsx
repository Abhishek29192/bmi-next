import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import LeadBlockSection, {
  Data as LeadBlockSectionProps
} from "../LeadBlockSection";
import { DataTypeEnum } from "../link/types";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import createLinkData from "../../__tests__/helpers/LinkHelper";

const link = createLinkData({
  __typename: "Link",
  id: "6HsgkUrFwhZhOBRpuhl1LD",
  label: "PostItCard Label",
  type: DataTypeEnum.Internal,
  linkedPage: {
    path: "contact-us/"
  }
});
const postItCardReferences = new Map();
postItCardReferences.set(link.id, link);

const leadBlockSectionData: LeadBlockSectionProps = {
  __typename: "LeadBlockSection",
  title: "Lead block title",
  text: createRichText({
    json: {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: "Text Section",
              nodeType: "text"
            }
          ]
        }
      ],
      data: {}
    },
    references: new Map()
  }),
  link: {
    __typename: "Link",
    id: "link-id",
    label: "Link Section Label",
    icon: null,
    isLabelHidden: null,
    url: "contact-us/",
    type: DataTypeEnum.Internal,
    parameters: null,
    dialogContent: null,
    linkedPage: { path: "/link-label-path" },
    hubSpotCTAID: null,
    queryParams: null
  },
  postItCard: createRichText({
    references: postItCardReferences,
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              data: {
                target: {
                  sys: {
                    id: "6HsgkUrFwhZhOBRpuhl1LD",
                    type: "Link",
                    linkType: "Entry"
                  }
                }
              },
              content: [],
              nodeType: BLOCKS.EMBEDDED_ENTRY
            },
            {
              content: [
                {
                  marks: [],
                  value: "PostItCard heading-5",
                  nodeType: "text",
                  data: {}
                }
              ],
              nodeType: BLOCKS.HEADING_5,
              data: {}
            }
          ],
          data: {}
        }
      ]
    }
  })
};

describe("LeadBlockSection", () => {
  it("renders correctly with link, text and postIt Card", () => {
    render(
      <ThemeProvider>
        <LeadBlockSection data={leadBlockSectionData} />
      </ThemeProvider>
    );
    expect(screen.getByText("Text Section")).toBeInTheDocument();
    expect(screen.getByText("Link Section Label")).toBeInTheDocument();
    expect(screen.getByText("PostItCard Label")).toBeInTheDocument();
  });

  it("renders leadBlock", () => {
    render(
      <ThemeProvider>
        <LeadBlockSection
          data={{ ...leadBlockSectionData, postItCard: null }}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("MC: page.jumpToSection")).toBeInTheDocument();
  });

  it("renders correct gtm-data on the linkSectionLabel anchor link", () => {
    render(
      <ThemeProvider>
        <LeadBlockSection data={{ ...leadBlockSectionData }} />
      </ThemeProvider>
    );

    const linkSectionLabel = screen.getByTestId(
      "anchor-link-Link-Section-Label"
    );

    expect(linkSectionLabel).toHaveAttribute(
      "data-gtm",
      '{"id":"cta-click1","action":"//link-label-path/","label":"Link Section Label"}'
    );
  });
});
