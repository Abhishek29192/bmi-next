import React from "react";
import { render } from "@testing-library/react";
import ExploreBarSection, { Data } from "../ExploreBarSection";

describe("ExploreBarSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulNavigation",
      label: "Lorem ipsum",
      links: [
        {
          __typename: "ContentfulLink",
          id: "link",
          label: "String",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page",
          linkedPage: null,
          type: "Internal",
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "link2",
          label: "Another string",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page-2",
          linkedPage: null,
          type: "Internal",
          parameters: null,
          dialogContent: null
        }
      ]
    };

    const { container } = render(<ExploreBarSection data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
