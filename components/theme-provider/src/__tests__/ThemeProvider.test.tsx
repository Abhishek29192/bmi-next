import React from "react";
import { render } from "@testing-library/react";
import merge from "lodash/merge";
import type { ThemeOptions } from "@material-ui/core";
import ThemeProvider, { getTheme } from "..";

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
    expect(getTheme(false).typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "3rem",
      fontWeight: 300,
      lineHeight: 1.2
    });
  });
  it("should return theme typography h1 values with long text", () => {
    expect(getTheme(true).typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "clamp(2rem, 1.62rem + 1vw, 3rem)",
      fontWeight: 300,
      lineHeight: 1.2
    });
  });

  it("should change line-height this expandTheme", () => {
    const expandTheme = (theme: ThemeOptions) =>
      merge(theme, {
        typography: {
          h1: {
            lineHeight: 2
          }
        }
      });
    expect(getTheme(true, expandTheme).typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "clamp(2rem, 1.62rem + 1vw, 3rem)",
      fontWeight: 300,
      lineHeight: 2
    });
  });
});
