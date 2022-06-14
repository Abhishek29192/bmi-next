import React from "react";
import { mockAddress } from "../../../fixtures/address";
import { render } from "../../../lib/tests/utils";
import { InlineAddress } from "../inlineAddress";

describe("Address", () => {
  it("Address not available", () => {
    const { container } = render(<InlineAddress address={null} />);
    expect(container).toMatchSnapshot();
  });
  it("Address available", () => {
    const { container } = render(<InlineAddress address={mockAddress} />);
    expect(container).toMatchSnapshot();
  });
});
