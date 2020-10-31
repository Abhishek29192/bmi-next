import React from "react";
import Sections, { Data } from "../Sections";
import { render } from "@testing-library/react";
import { BLOCKS } from "@contentful/rich-text-types";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("Sections component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            title: "hello",
            content: {
              json: {
                data: {},
                nodeType: BLOCKS.DOCUMENT,
                content: []
              }
            }
          }
        ],
        title: "string",
        type: "Accordion"
      },
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            title: "hello",
            content: {
              json: {
                data: {},
                nodeType: BLOCKS.DOCUMENT,
                content: []
              }
            }
          }
        ],
        title: "string",
        type: "Tabs"
      },
      {
        __typename: "ContentfulVillainSection",
        title: "Title",
        promo: {
          __typename: "ContentfulPromo",
          title: "Promo",
          brandLogo: null,
          subtitle: null,
          featuredImage: null,
          cta: null
        }
      },
      {
        __typename: "ContentfulLeadBlockSection",
        text: {
          json: {
            data: {},
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: "lead block heading",
                    nodeType: "text"
                  }
                ],
                nodeType: BLOCKS.HEADING_2
              },
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: "lead block content",
                    nodeType: "text"
                  }
                ],
                nodeType: BLOCKS.PARAGRAPH
              }
            ],
            nodeType: BLOCKS.DOCUMENT
          }
        },
        link: {
          __typename: "ContentfulLink",
          id: "00000000-0000-0000-0000-000000000000",
          label: "lead block cta label",
          icon: null,
          isLabelHidden: null,
          url: null,
          linkedPage: {
            slug: "contact-us"
          }
        },
        cardTheme: "pearl",
        cardSections: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            hasUnderline: true,
            title: "card section 1 title",
            description: {
              description: "card section 1 description"
            },
            link: {
              __typename: "ContentfulLink",
              id: "00000000-0000-0000-0000-000000000000",
              label: "card section 1 link label",
              icon: null,
              isLabelHidden: null,
              url: "/",
              linkedPage: null
            },
            linkType: null
          }
        ]
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card collection section title",
        cardLabel: "Card Label",
        cardType: "Next Best Action Card",
        cards: [
          {
            __typename: "ContentfulPromo",
            title: "promo title",
            brandLogo: "AeroDek",
            subtitle: "promo subtitle",
            featuredImage: null,
            cta: {
              __typename: "ContentfulLink",
              id: "00000000-0000-0000-0000-000000000000",
              label: "Contact us",
              icon: null,
              isLabelHidden: null,
              url: null,
              linkedPage: {
                slug: "contact-us"
              }
            },
            id: "00000000-0000-0000-0000-000000000000"
          }
        ]
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card section title 2",
        cardLabel: "Go to {{title}}",
        cardType: "Product Overview Card",
        cards: [
          {
            __typename: "ContentfulSimplePage",
            id: "00000000-0000-0000-0000-000000000000",
            slug: "slug",
            title: "page title",
            brandLogo: null,
            subtitle: "page subtitle",
            featuredImage: {
              resize: {
                src: "//image-url"
              }
            }
          }
        ]
      }
    ];

    const { container } = render(<Sections data={data} />);
    expect(container.children).toMatchSnapshot();
  });
});
