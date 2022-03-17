import "./src/styles/global.css";
import React from "react";
import { ThemeProvider } from "@bmi/components";

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>;
};
