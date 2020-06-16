import React from "react";
import Button from "../";
import { render } from "@testing-library/react";

describe("Button component", () => {
  it("renders correctly", () => {
    const { container } = render(<Button>Hello World</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
