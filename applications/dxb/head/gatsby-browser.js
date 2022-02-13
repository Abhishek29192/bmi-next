import "./src/styles/global.css";
import React from "react";
import BmiThemeProvider from "@bmi-digital/components/theme-provider";

export const wrapRootElement = ({ element }) => {
  return (
    <BmiThemeProvider includeCssBaseline={false}>{element}</BmiThemeProvider>
  );
};
