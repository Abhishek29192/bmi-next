import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContentfulRichTextGatsbyReference } from "gatsby-source-contentful/rich-text";
import React from "react";
import memoize from "../../utils/memoize";
import RichText, { RichTextData } from "../RichText";

jest.mock("../../utils/memoize", () => {
  return jest.fn((func) => func);
});

const useIsClientMock = jest.fn();

jest.mock("@bmi-digital/components", () => ({
  ...jest.requireActual("@bmi-digital/components"),
  useIsClient: () => useIsClientMock()
}));

const raw = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: "heading-2",
      content: [{ nodeType: "text", value: "Heading 2", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "heading-3",
      content: [{ nodeType: "text", value: "Heading 3", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "heading-4",
      content: [{ nodeType: "text", value: "Heading 4", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "heading-5",
      content: [{ nodeType: "text", value: "Heading 5", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "heading-6",
      content: [{ nodeType: "text", value: "Heading 6", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [{ nodeType: "text", value: "", marks: [], data: {} }],
      data: {}
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
          nodeType: "hyperlink",
          content: [
            { nodeType: "text", value: "External", marks: [], data: {} }
          ],
          data: { uri: "https://google.co.uk" }
        },
        { nodeType: "text", value: " ", marks: [], data: {} },
        {
          nodeType: "entry-hyperlink",
          content: [{ nodeType: "text", value: "Entry", marks: [], data: {} }],
          data: {
            target: {
              sys: {
                id: "6Eg6rK4nkEc3M1NFE8E4jU",
                type: "Link",
                linkType: "Entry"
              }
            }
          }
        },
        { nodeType: "text", value: " ", marks: [], data: {} },
        {
          nodeType: "asset-hyperlink",
          content: [{ nodeType: "text", value: "Asset", marks: [], data: {} }],
          data: {
            target: {
              sys: {
                id: "70GS3lLVmrS7k71kH3iSbq",
                type: "Link",
                linkType: "Asset"
              }
            }
          }
        },
        { nodeType: "text", value: " ", marks: [], data: {} },
        {
          nodeType: "embedded-entry-inline",
          content: [],
          data: {
            target: {
              sys: {
                id: "3tcysaa3PGMlm42U4WnlmK",
                type: "Link",
                linkType: "Entry"
              }
            }
          }
        },
        { nodeType: "text", value: "", marks: [], data: {} }
      ],
      data: {}
    },
    {
      nodeType: "unordered-list",
      content: [
        {
          nodeType: "list-item",
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              content: [{ nodeType: "text", value: "UL", marks: [], data: {} }],
              data: {}
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: "ordered-list",
      content: [
        {
          nodeType: "list-item",
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              content: [{ nodeType: "text", value: "OL", marks: [], data: {} }],
              data: {}
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: "blockquote",
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            { nodeType: "text", value: "Blockquote", marks: [], data: {} }
          ],
          data: {}
        }
      ],
      data: {}
    },
    { nodeType: "hr", content: [], data: {} },
    {
      nodeType: "embedded-entry-block",
      content: [],
      data: {
        target: {
          sys: {
            id: "1oPjxfZfvqmyAMIZx6rPgm",
            type: "Link",
            linkType: "Entry"
          }
        }
      }
    },
    {
      nodeType: "embedded-asset-block",
      content: [],
      data: {
        target: {
          sys: {
            id: "70GS3lLVmrS7k71kH3iSbq",
            type: "Link",
            linkType: "Asset"
          }
        }
      }
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [{ nodeType: "text", value: "", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "entry-hyperlink",
          content: [
            {
              nodeType: "text",
              value: "Open dialog",
              marks: [],
              data: {}
            }
          ],
          data: {
            target: {
              sys: {
                id: "7di9aTEBjpoTGECA229JYr",
                type: "Link",
                linkType: "Entry"
              }
            }
          }
        },
        { nodeType: "text", value: "", marks: [], data: {} }
      ],
      data: {}
    }
  ]
};

const document: RichTextData = {
  raw: JSON.stringify(raw),
  references: [
    {
      __typename: "ContentfulSimplePage",
      contentful_id: "6Eg6rK4nkEc3M1NFE8E4jU",
      path: "testing-simple-page/"
    } as ContentfulRichTextGatsbyReference,
    {
      __typename: "ContentfulAsset",
      contentful_id: "70GS3lLVmrS7k71kH3iSbq",
      title: "Customer Support",
      file: {
        contentType: "image/png",
        url: "//images.ctfassets.net/lyjgwec8n2tq/70GS3lLVmrS7k71kH3iSbq/425f76789e7f7a8cb10d1d4ed9073d95/Customer-support.png"
      }
    } as ContentfulRichTextGatsbyReference,
    {
      __typename: "ContentfulLink",
      contentful_id: "3tcysaa3PGMlm42U4WnlmK",
      icon: "AeroDek",
      id: "ddf00d82-c0de-5520-8929-78146ec48f8e",
      isLabelHidden: false,
      label: "Aerodek Robust Plus",
      parameters: null,
      type: "Internal",
      url: null,
      linkedPage: {
        path: "product-category-page/product-sub-category-page/aerodek-robust-plus/"
      }
    } as ContentfulRichTextGatsbyReference,
    {
      contentful_id: "1oPjxfZfvqmyAMIZx6rPgm",
      id: "414f8808-3e8c-5f7b-a437-dba556a4b23a",
      isLabelHidden: null,
      label: "Support",
      linkedPage: { path: "landing-page/" },
      parameters: null,
      type: "Internal",
      url: null,
      __typename: "ContentfulLink"
    } as ContentfulRichTextGatsbyReference,
    {
      contentful_id: "7di9aTEBjpoTGECA229JYr",
      asset: null,
      dialogContent: {
        __typename: "ContentfulFormSection",
        title: "Test form",
        showTitle: null,
        description: null,
        recipients: "recipient@mail.com",
        inputs: null,
        submitText: "Submit",
        successRedirect: {
          __typename: "ContentfulLink",
          id: "link",
          label: "Thank you",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page",
          linkedPage: null,
          type: "Internal",
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        },
        source: "HubSpot",
        hubSpotFormGuid: "abc123"
      },
      hubSpotCTAID: null,
      icon: null,
      id: "3a9c98c9-2722-5f6a-9434-f009b0cf5ef0",
      isLabelHidden: null,
      label: "HubSpot form Dialog CTA",
      linkedPage: null,
      parameters: null,
      type: "Dialog",
      url: null,
      __typename: "ContentfulLink"
    } as ContentfulRichTextGatsbyReference
  ]
};

describe("RichText component", () => {
  beforeEach(() => {
    // Clear memoization cache before each test
    (memoize as jest.Mock).mockClear();
    useIsClientMock.mockReturnValue({ isClient: true });
  });

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText document={document} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with gtmLabel", () => {
    render(
      <ThemeProvider>
        <RichText gtmLabel="gtmLabelTest" document={document} />
      </ThemeProvider>
    );

    const expectedDataGtm = {
      id: "cta-click1",
      label: "gtmLabelTest - Entry",
      action: "/testing-simple-page/"
    };

    expect(
      screen.getByTestId("rich-text-entry-hyperlink").getAttribute("data-gtm")
    ).toEqual(JSON.stringify(expectedDataGtm));
  });

  it("renders when dialog clicked", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText document={document} />
      </ThemeProvider>
    );
    const openDialogButton = screen.getByText("Open dialog");
    fireEvent.click(openDialogButton);
    expect(container).toMatchSnapshot();
  });

  it("closes dialog", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText document={document} />
      </ThemeProvider>
    );
    const openDialogButton = screen.getByText("Open dialog");
    fireEvent.click(openDialogButton);
    const closeDialogButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeDialogButton);
    expect(container).toMatchSnapshot();
  });

  it("falls back with incorrect data", () => {
    const raw = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: "embedded-entry-inline",
              content: [],
              data: {
                target: {
                  sys: {
                    id: "3tcysaa3PGMlm42U4WnlmK",
                    type: "Link",
                    linkType: "Entry"
                  }
                }
              }
            }
          ],
          data: {}
        }
      ]
    };

    const document: RichTextData = {
      raw: JSON.stringify(raw),
      references: [
        {
          __typename: "NonType",
          contentful_id: "3tcysaa3PGMlm42U4WnlmK"
        }
      ]
    };

    const { container } = render(
      <ThemeProvider>
        <RichText document={document} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no data", () => {
    const { container } = render(
      <ThemeProvider>
        <RichText />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});

describe("Intouch link behavior", () => {
  it("generates correct href if link is not intouch link and isClient is true and passes correct GTM attributes", () => {
    useIsClientMock.mockReturnValue({ isClient: true });

    render(
      <ThemeProvider>
        <RichText gtmLabel="gtmLabelTest" document={document} />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByTestId("rich-text-hyperlink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref = "https://google.co.uk";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    expect(buttonOrLink).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        label: "gtmLabelTest - External",
        action: "https://google.co.uk"
      })
    );
  });

  it("generates correct href if link is intouch link and is isClient is true  and passes correct GTM attributes", () => {
    useIsClientMock.mockReturnValue({ isClient: true });
    const originalEnv = process.env.GATSBY_INTOUCH_ORIGIN;
    process.env.GATSBY_INTOUCH_ORIGIN = "https://google.co.uk";

    render(
      <ThemeProvider>
        <RichText gtmLabel="gtmLabelTest" document={document} />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByTestId("rich-text-hyperlink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref =
      "https://google.co.uk?prev_page=http%3A%2F%2Flocalhost%2F";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    expect(buttonOrLink).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        label: "gtmLabelTest - External",
        action: "https://google.co.uk?prev_page=http%3A%2F%2Flocalhost%2F"
      })
    );

    process.env.GATSBY_INTOUCH_ORIGIN = originalEnv;
  });

  it("generates correct href if link is not intouch link and isClient is false and passes correct GTM attributes", () => {
    useIsClientMock.mockReturnValue({ isClient: false });

    render(
      <ThemeProvider>
        <RichText gtmLabel="gtmLabelTest" document={document} />
      </ThemeProvider>
    );

    const buttonOrLink = screen.getByTestId("rich-text-hyperlink");

    expect(buttonOrLink).toBeInTheDocument();

    const expectedHref = "https://google.co.uk";

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    expect(buttonOrLink.getAttribute("href")).toBe(expectedHref);

    expect(buttonOrLink).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        label: "gtmLabelTest - External",
        action: "https://google.co.uk"
      })
    );
  });
});
