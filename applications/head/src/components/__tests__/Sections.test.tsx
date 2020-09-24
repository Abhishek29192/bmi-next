import React from "react";
import Sections, { Data } from "../Sections";
import { render } from "@testing-library/react";
import { BLOCKS } from "@contentful/rich-text-types";

describe("Sections component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        backgroundColor: "pearl",
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
        backgroundColor: "white",
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
        backgroundColor: "pearl",
        title: "Title",
        hero: {
          title: "Hero",
          image: null,
          cta: null
        },
        isReversed: null,
        type: "Tabs"
      }
    ];

    const { container } = render(<Sections data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
