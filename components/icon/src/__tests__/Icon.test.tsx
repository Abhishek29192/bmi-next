import React from "react";
import Icon from "../";
import { render } from "@testing-library/react";

describe("Icon component", () => {
  it("renders correctly", () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
