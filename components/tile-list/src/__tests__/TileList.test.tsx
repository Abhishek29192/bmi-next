import React from "react";
import TileList from "../";
import { render } from "@testing-library/react";

describe("TileList component", () => {
  it("renders correctly", () => {
    const { container } = render(<TileList />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
