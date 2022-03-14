import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import HidePrint from "../HidePrint";

describe("HidePrint component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <HidePrint>Lorem Ipsum</HidePrint>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with custom component", () => {
    const { container } = renderWithThemeProvider(
      <HidePrint component="span">Lorem Ipsum</HidePrint>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with custom className", () => {
    const { container } = renderWithThemeProvider(
      <HidePrint className="test">Lorem Ipsum</HidePrint>
    );
    expect(container).toMatchSnapshot();
  });
});
