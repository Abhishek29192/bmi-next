import React from "react";
import { render } from "@testing-library/react";
import ContactTopics from "../ContactTopics";

const contentMock = JSON.stringify({
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
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
});

describe("ContactTopics component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ContactTopics
        topics={[
          {
            icon: "build",
            title: "Did you know?1",
            bodyTitle: "Did you know?2",
            bodyList: [
              {
                __typename: "ContentfulTitleWithContent",
                title: "Frequently Asked Questions",
                content: { raw: contentMock, references: [] }
              },
              {
                __typename: "ContentfulTitleWithContent",
                title: "CloseDach",
                content: { raw: contentMock, references: [] }
              }
            ],
            footerTitle: "footer title",
            footerList: [
              {
                __typename: "ContentfulTitleWithContent",
                title: "teste",
                content: { raw: contentMock, references: [] }
              }
            ]
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});