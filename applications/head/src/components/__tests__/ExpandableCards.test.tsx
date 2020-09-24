import React from "react";
import ExpandableCards from "../ExpandableCards";
import { render } from "@testing-library/react";

describe("ExpandableCards component", () => {
  it("renders correctly", () => {
    const { container } = render(<ExpandableCards />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
