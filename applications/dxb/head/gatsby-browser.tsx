import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import { modifyTheme } from "./src/styles/modifyTheme";
import type { GatsbyBrowser } from "gatsby";
import "./src/styles/global.css";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element
}) => {
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
