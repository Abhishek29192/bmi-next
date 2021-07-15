import React from "react";
import { render } from "@testing-library/react";
import ThemeProvider, { getTheme } from "../ThemeProvider";

describe("ThemeProvider component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <span>Test</span>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("getTheme", () => {
  it("should return theme typography h1 values without long text", () => {
    expect(getTheme(false).typography).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "3rem",
      lineHeight: 1.2
    });
  });
  it("should return theme typography h1 values with long text", () => {
    expect(getTheme(true).typography).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "3rem",
      lineHeight: 1.2
    });
  });
});
