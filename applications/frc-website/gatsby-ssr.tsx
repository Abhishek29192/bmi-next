import ThemeProvider from "@bmi-digital/components/theme-provider";
import React from "react";
import type { GatsbySSR } from "gatsby";

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>;
};
