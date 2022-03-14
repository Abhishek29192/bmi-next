import { TypographyOptions } from "@material-ui/core/styles/createTypography";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import ThemeProvider, { getTheme, ThemeOptions } from "../ThemeProvider";

describe("ThemeProvider component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ThemeProvider>
        <span>Test</span>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
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
    const expandTheme = (theme: ThemeOptions) => {
      (theme.typography as TypographyOptions).h1!.lineHeight = 2;
      return theme;
    };
    expect(getTheme(expandTheme).typography.h1).toEqual({
      fontFamily: "Effra Heavy",
      fontSize: "2.125rem",
      fontWeight: 300,
      lineHeight: 2
    });
  });
});
