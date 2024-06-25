import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import "./src/styles/global.css";
import { theme } from "./src/styles/modifyTheme";
import type { GatsbyBrowser } from "gatsby";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element
}) => {
  return (
    /*providers with static data*/
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <HubspotProvider async={false} addToHead={true}>
          {element}
        </HubspotProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};
