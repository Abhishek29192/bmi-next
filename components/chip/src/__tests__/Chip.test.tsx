import React from "react";
import Chip from "../";
import { render } from "@testing-library/react";

describe("Chip component", () => {
  it("renders correctly", () => {
    const { container } = render(<Chip />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
