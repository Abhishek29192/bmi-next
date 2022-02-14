import { render } from "@testing-library/react";
import React from "react";
import Grid from "../";

describe("Grid component", () => {
  it("renders correctly", () => {
    const { container } = render(<Grid />);
    expect(container).toMatchSnapshot();
  });

  it("item renders correctly", () => {
    const { container } = render(<Grid item />);
    expect(container).toMatchSnapshot();
  });

  it("renders when centered", () => {
    const { container } = render(<Grid justify="center" />);
    expect(container).toMatchSnapshot();
  });
});
