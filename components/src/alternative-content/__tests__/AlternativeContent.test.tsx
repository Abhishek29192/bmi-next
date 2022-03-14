import React from "react";
import AlternativeContent from "../AlternativeContent";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("AlternativeContent component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <AlternativeContent>Lorem Ipsum</AlternativeContent>
    );
    expect(container).toMatchSnapshot();
  });
});
