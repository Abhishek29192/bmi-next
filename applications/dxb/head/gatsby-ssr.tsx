import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import { ThemeOptions, ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import type { GatsbySSR } from "gatsby";
import "./src/styles/global.css";

export const modifyTheme = (theme: ThemeOptions): ThemeOptions => {
  return {
    ...theme,
    components: {
      MuiCssBaseline: {
        styleOverrides: `
              ${theme.components?.MuiCssBaseline?.styleOverrides}
              body { background-color: ${theme.colours.alabasterA} !important}  `
      }
    }
  };
};

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return (
    /*providers with static data*/
    <ConfigProvider>
      <ThemeProvider modifyTheme={modifyTheme}>
        <HubspotProvider async={false} addToHead={true}>
          {element}
        </HubspotProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};
