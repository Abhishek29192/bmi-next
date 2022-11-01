import { BmiThemeProvider } from "@bmi-digital/components";
import { CssBaseline } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import React from "react";
import "../../styles/globals.css";
import "../storybook.css";

export const ThemeDecorator = (Story) => (
  <StylesProvider injectFirst={true}>
    <CssBaseline />
    <BmiThemeProvider>
      <Story />
    </BmiThemeProvider>
  </StylesProvider>
);
