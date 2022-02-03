import React from "react";
import { render } from "@testing-library/react";
import { FilterInput } from "..";

describe("FilterInput Component", () => {
  it("renders correctly", () => {
    const { container } = render(<FilterInput label="Filter Input" />);

    expect(container).toMatchSnapshot();
  });
});
