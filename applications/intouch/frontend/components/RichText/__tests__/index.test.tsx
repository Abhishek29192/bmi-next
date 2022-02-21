import React from "react";
import { render } from "@testing-library/react";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { RichText } from "..";

const mockDocument: Document = {
  nodeType: BLOCKS.DOCUMENT,
  content: [],
  data: {}
};

describe("RichText component", () => {
  it("falls back with empty data", () => {
    const { container } = render(<RichText content={mockDocument} />);
    expect(container).toMatchSnapshot();
  });
});
