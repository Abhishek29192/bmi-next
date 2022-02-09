import React from "react";
import { render } from "@testing-library/react";
import { FilterButton } from "..";

describe("FilterButton Component", () => {
  it("renders correctly", () => {
    const { container } = render(<FilterButton label="Filter Button" />);

    expect(container).toMatchSnapshot();
  });
});
