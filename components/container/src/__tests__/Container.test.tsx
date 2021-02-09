import React from "react";
import { render } from "@testing-library/react";
import Container from "../";

describe("Container component", () => {
  it("renders correctly", () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
