import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import ExploreBarSection, { Data } from "../ExploreBarSection";
import { DataTypeEnum } from "../link/types";

describe("ExploreBarSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "Navigation",
      label: "Lorem ipsum",
      links: [
        {
          __typename: "Link",
          id: "link",
          label: "String",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page",
          linkedPage: null,
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null,
          queryParams: null
        },
        {
          __typename: "Link",
          id: "link2",
          label: "Another string",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page-2",
          linkedPage: null,
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null,
          queryParams: null
        },
        // This is how a nested Navigation comes through from Contentful
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {}
      ]
    };

    const { container } = render(
      <ThemeProvider>
        <ExploreBarSection data={data} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
