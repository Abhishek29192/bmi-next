import React from "react";
import Button from "../";
import { render } from "@testing-library/react";

describe("Button component", () => {
  it("renders correctly", () => {
    const { container } = render(<Button label={"Hello World"} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
