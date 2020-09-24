import React from "react";
import Icon from "../Icon";
import { render } from "@testing-library/react";

describe("Icon component", () => {
  it("renders correctly", () => {
    const { container } = render(<Icon name="Facebook" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
