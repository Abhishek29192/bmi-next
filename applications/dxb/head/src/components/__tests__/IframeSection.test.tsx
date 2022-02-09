import { render } from "@testing-library/react";
import React from "react";
import IframeSection, { Data } from "../IframeSection";

describe("IframeSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulIframe",
      title: "iFrame Section",
      summary: {
        raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Summary","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
        references: []
      },
      url: "https://google.co.uk",
      height: "450px"
    };

    const { container } = render(<IframeSection data={data} />);
    expect(container).toMatchSnapshot();
  });
});
