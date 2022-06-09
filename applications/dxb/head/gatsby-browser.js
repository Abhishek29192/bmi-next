import { ThemeProvider } from "@bmi/components";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider.tsx";
import "./src/styles/global.css";

export const wrapRootElement = ({ element }) => {
  return (
    <ConfigProvider>
      <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>
    </ConfigProvider>
  );
};
