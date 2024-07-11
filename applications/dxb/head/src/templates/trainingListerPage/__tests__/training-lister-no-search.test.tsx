import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { Data as TitleWithContentData } from "../../../components/TitleWithContent";
import TrainingNoResults from "../components/training-no-results";
import createRichText from "../../../__tests__/helpers/RichTextHelper";

const searchTips: TitleWithContentData = {
  __typename: "TitleWithContent",
  name: "search",
  title: "Search Tips",
  content: createRichText({
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.UL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: "text",
                      value: "Check your spelling ",
                      marks: [],
                      data: {}
                    }
                  ]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: "text",
                      value: "Try more general terms or fewer keywords",
                      marks: [],
                      data: {}
                    }
                  ]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: "text",
                      value: "Try a similar but different search term",
                      marks: [],
                      data: {}
                    }
                  ]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: "text",
                      value: "Try browsing through our trainings",
                      marks: [],
                      data: {}
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "", marks: [], data: {} }]
        }
      ]
    }
  })
};

describe("Training-no-search", () => {
  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <TrainingNoResults searchTips={searchTips} />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: trainingListerPage.noSearch.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: trainingListerPage.noSearch.description")
    ).toBeInTheDocument();
  });
});
