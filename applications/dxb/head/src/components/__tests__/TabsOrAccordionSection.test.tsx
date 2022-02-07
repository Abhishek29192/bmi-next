import React from "react";
import { render } from "@testing-library/react";
import TabsOrAccordionSection, { Data } from "../TabsOrAccordionSection";

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

const getDummyData = ({ name, title, type }): Data => {
  return {
    __typename: "ContentfulTabsOrAccordionSection",
    description: { description: "string" },
    items: [
      {
        __typename: "ContentfulTitleWithContent",
        name: name,
        title: title,
        content: {
          raw: contentMock,
          references: []
        }
      }
    ],
    title: "string",
    type: type
  };
};
const dataWithNoItems: Data = {
  __typename: "ContentfulTabsOrAccordionSection",
  description: { description: "string" },
  items: [],
  title: "string",
  type: "Tabs"
};

describe("TabsOrAccordionSection", () => {
  it("Accordion renders Correctly ", () => {
    const { container, queryByText } = render(
      <TabsOrAccordionSection
        data={getDummyData({ name: "name", title: "hello", type: "Accordion" })}
      />
    );
    expect(queryByText("hello")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
  it("Tabs renders Correctly ", () => {
    const { container, queryByText } = render(
      <TabsOrAccordionSection
        data={getDummyData({ name: "name", title: "hello", type: "Tabs" })}
      />
    );
    expect(queryByText("hello")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it("Tabs default to name if title is null", () => {
    const { container, queryByText } = render(
      <TabsOrAccordionSection
        data={getDummyData({ name: "name", title: null, type: "Tabs" })}
      />
    );
    expect(queryByText("name")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
  it("title attribute is rendered if both name and title exists for tab panels", () => {
    const { container, queryByText } = render(
      <TabsOrAccordionSection
        data={getDummyData({ name: "name", title: "title", type: "Tabs" })}
      />
    );
    expect(queryByText("name")).toBeNull();
    expect(queryByText("title")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
  it("no data return null", () => {
    const { container } = render(<TabsOrAccordionSection data={null} />);
    expect(container.firstChild).toBeNull();
  });
  it("not render tab panel if item array is empty", () => {
    const { container } = render(
      <TabsOrAccordionSection data={dataWithNoItems} />
    );
    expect(container).toMatchSnapshot();
  });
});
