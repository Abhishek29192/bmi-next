import React from "react";
import Container from "../";
import { render } from "@testing-library/react";

describe("Container component", () => {
  it("renders correctly", () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
