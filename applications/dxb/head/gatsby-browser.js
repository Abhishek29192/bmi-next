import "./src/styles/global.css";
import React from "react";
import { ThemeProvider } from "@bmi/components";
import { ConfigProvider } from "./src/contexts/ConfigProvider.tsx";

export const wrapRootElement = ({ element }) => {
  return (
    <ConfigProvider>
      <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>
    </ConfigProvider>
  );
};
