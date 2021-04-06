import React from "react";
import { render } from "@testing-library/react";
import Media from "../";

describe("Media component", () => {
  it("renders correctly", () => {
    const { container } = render(<Media />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
