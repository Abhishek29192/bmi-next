import React from "react";
import Sections, { Data } from "../Sections";
import { render } from "@testing-library/react";
import { BLOCKS } from "@contentful/rich-text-types";

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
          subtitle: null,
          featuredImage: null,
          cta: null
        },
        isReversed: null
      }
    ];

    const { container } = render(<Sections data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
