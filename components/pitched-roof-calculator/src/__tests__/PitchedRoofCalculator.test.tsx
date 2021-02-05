import React from "react";
import { render } from "@testing-library/react";
import PitchedRoofCalculator from "../";

describe("PitchedRoofCalculator component", () => {
  it("renders correctly", () => {
    const { container } = render(<PitchedRoofCalculator />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
