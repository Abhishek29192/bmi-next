import React from "react";
import BmiThemeProvider from "@bmi-digital/components/theme-provider";
import { StylesProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import "../storybook.css";
import "../../styles/globals.css";

export const ThemeDecorator = (Story) => (
  <StylesProvider injectFirst={true}>
    <CssBaseline />
    <BmiThemeProvider>
      <Story />
    </BmiThemeProvider>
  </StylesProvider>
);
