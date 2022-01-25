import React from "react";
import { render } from "@testing-library/react";
import Container from "../";

describe("Container component", () => {
  it("renders correctly", () => {
    const { container } = render(<Container>Content</Container>);
    expect(container).toMatchSnapshot();
  });

  it("allows wrapper className", () => {
    const { container } = render(
      <Container wrapperClassName={"wrapper-className"}>Content</Container>
    );
    expect(container).toMatchSnapshot();
  });

  it("allows full-width mode", () => {
    const { container } = render(<Container fullWidth>Content</Container>);
    expect(container).toMatchSnapshot();
  });
});
