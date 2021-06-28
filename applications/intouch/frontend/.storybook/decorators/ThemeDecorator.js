import React from "react";
import { StylesProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import "../storybook.css";
import "../../styles/globals.css";

export const ThemeDecorator = (Story) => (
  <StylesProvider injectFirst={true}>
    <CssBaseline />
    <Story />
  </StylesProvider>
);
