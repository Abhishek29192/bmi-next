import { ThemeProvider } from "@bmi/components";
import type { GatsbyBrowser } from "gatsby";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import "./src/styles/global.css";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element
}) => {
  return (
    <ConfigProvider>
      <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>
    </ConfigProvider>
  );
};
