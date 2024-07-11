import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import ContactTopics from "../ContactTopics";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import type { RichTextData } from "../RichText";

const contentMock: RichTextData["json"] = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

describe("ContactTopics component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <ContactTopics
          topics={[
            {
              icon: "build",
              title: "Did you know?1",
              bodyTitle: "Did you know?2",
              bodyList: [
                {
                  __typename: "TitleWithContent",
                  name: "Frequently Asked Questions",
                  title: "Frequently Asked Questions",
                  content: createRichText({
                    json: contentMock
                  })
                },
                {
                  __typename: "TitleWithContent",
                  name: "CloseDach",
                  title: "CloseDach",
                  content: createRichText({ json: contentMock })
                }
              ],
              footerTitle: "footer title",
              footerList: [
                {
                  __typename: "TitleWithContent",
                  name: "teste",
                  title: "teste",
                  content: createRichText({ json: contentMock })
                }
              ]
            }
          ]}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
