import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import TabsOrAccordionSection, { Data } from "../TabsOrAccordionSection";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import type { TitleWithContentData } from "../SystemConfiguratorSection";
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

type GetDummyDataType = {
  name: TitleWithContentData["name"];
  title: Data["title"];
  type: Data["type"];
};

const getDummyData = ({ name, title, type }: GetDummyDataType): Data => {
  return {
    __typename: "ContentfulTabsOrAccordionSection",
    description: { description: "string" },
    items: [
      {
        __typename: "TitleWithContent",
        name: name,
        title: title,
        content: createRichText({
          json: contentMock
        })
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
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection
          data={getDummyData({
            name: "name",
            title: "hello",
            type: "Accordion"
          })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("Tabs renders Correctly ", () => {
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection
          data={getDummyData({ name: "name", title: "hello", type: "Tabs" })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("Tabs default to name if title is null", () => {
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection
          data={getDummyData({ name: "name", title: null, type: "Tabs" })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("Accordion default to name if title is null", () => {
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection
          data={getDummyData({ name: "name", title: null, type: "Accordion" })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("title attribute is rendered if both name and title exists for tab panels", () => {
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection
          data={getDummyData({ name: "name", title: "title", type: "Tabs" })}
        />
      </ThemeProvider>
    );
    expect(screen.queryByText("name")).not.toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it("not render tab panel if item array is empty", () => {
    const { container } = render(
      <ThemeProvider>
        <TabsOrAccordionSection data={dataWithNoItems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
