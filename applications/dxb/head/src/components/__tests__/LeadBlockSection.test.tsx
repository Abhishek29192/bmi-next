import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ContentfulRichTextGatsbyReference } from "gatsby-source-contentful/rich-text";
import React from "react";
import LeadBlockSection, {
  Data as LeadBlockSectionProps
} from "../LeadBlockSection";
import { DataTypeEnum } from "../link/types";

const leadBlockSectionData: LeadBlockSectionProps = {
  __typename: "ContentfulLeadBlockSection",
  title: "Lead block title",
  text: {
    raw: '{"nodeType":"paragraph","content":[{"nodeType":"text","value":"Text Section","marks":[],"data":{}}],"data":{}}',
    references: []
  },
  link: {
    __typename: "ContentfulLink",
    id: "link-id",
    label: "Link Section Label",
    icon: null,
    isLabelHidden: null,
    url: "contact-us/",
    type: DataTypeEnum.Internal,
    parameters: null,
    dialogContent: null,
    linkedPage: { path: "/link-label-path" },
    hubSpotCTAID: null
  },
  postItCard: {
    references: [
      {
        __typename: "ContentfulLink",
        contentful_id: "6HsgkUrFwhZhOBRpuhl1LD",
        id: "b48574ce-6067-541e-853d-e7824dd2ff3b",
        label: "PostItCard Label",
        type: "Internal",
        linkedPage: {
          path: "contact-us/"
        }
      } as ContentfulRichTextGatsbyReference
    ],
    raw: JSON.stringify({
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
          nodeType: "embedded-entry-block"
        },
        {
          content: [
            {
              marks: [],
              value: "PostItCard heading-5",
              nodeType: "text"
            }
          ],
          nodeType: "heading-5"
        }
      ]
    })
  }
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
