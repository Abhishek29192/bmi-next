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
  it("should return theme typography h1 values", () => {
    expect(getTheme().typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "2.125rem",
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
    expect(getTheme(expandTheme).typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "2.125rem",
      fontWeight: 300,
      lineHeight: 2
    });
  });
});
