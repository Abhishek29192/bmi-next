import React from "react";
import Container from "../";
import { render } from "@testing-library/react";

describe("Container component", () => {
  it("renders correctly", () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with no overflow", () => {
    const { container } = render(
      <Container hasRevertOverflow>Content</Container>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
