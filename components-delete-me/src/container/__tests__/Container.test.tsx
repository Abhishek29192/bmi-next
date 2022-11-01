import React from "react";
import Container from "../Container";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Container component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Container>Content</Container>
    );
    expect(container).toMatchSnapshot();
  });

  it("allows wrapper className", () => {
    const { container } = renderWithThemeProvider(
      <Container wrapperClassName={"wrapper-className"}>Content</Container>
    );
    expect(container).toMatchSnapshot();
  });

  it("allows full-width mode", () => {
    const { container } = renderWithThemeProvider(
      <Container fullWidth>Content</Container>
    );
    expect(container).toMatchSnapshot();
  });
});
