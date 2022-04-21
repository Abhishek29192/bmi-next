import { ThemeProvider } from "@bmi/components";
import type { GatsbySSR } from "gatsby";
import React from "react";
import "./src/styles/global.css";

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>;
};
