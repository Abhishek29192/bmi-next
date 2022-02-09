import React from "react";
import { render } from "@testing-library/react";
import ExploreBarSection, { Data } from "../ExploreBarSection";
import { DataTypeEnum } from "../Link";

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
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        },
        {
          __typename: "ContentfulLink",
          id: "link2",
          label: "Another string",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page-2",
          linkedPage: null,
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        },
        // @ts-ignore This is how a nested Navigation comes through from Contentful
        {}
      ]
    };

    const { container } = render(<ExploreBarSection data={data} />);

    expect(container).toMatchSnapshot();
  });
});
