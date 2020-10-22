import React from "react";
import ContentTopics from "../ContentTopics";
import { render } from "@testing-library/react";
import { Document } from "@contentful/rich-text-types";

const contentMock = {
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
};

describe("ContentTopics component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ContentTopics
        topics={[
          {
            icon: "build",
            title: "Did you know?1",
            bodyTitle: "Did you know?2",
            bodyList: [
              {
                title: "Frequently Asked Questions",
                content: { json: contentMock as Document }
              },
              {
                title: "CloseDach",
                content: { json: contentMock as Document }
              }
            ],
            footerTitle: "footer title",
            footerList: [
              {
                title: "teste",
                content: { json: contentMock as Document }
              }
            ]
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
