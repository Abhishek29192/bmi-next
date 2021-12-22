import "./src/styles/global.css";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider.tsx";
import { ThemeProvider } from "@bmi/components";

export const wrapRootElement = ({ element }) => {
  return (
    <ConfigProvider>
      <ThemeProvider includeCssBaseline={false}>{element}</ThemeProvider>
    </ConfigProvider>
  );
};
