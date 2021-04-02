import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";

import "../storybook.css";
import "../../styles/globals.css";

export const ThemeDecorator = (Story) => (
  <BmiThemeProvider>
    <Story />
  </BmiThemeProvider>
);
