import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import { ThemeProvider } from "@bmi-digital/components";
import type { GatsbySSR } from "gatsby";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import "./src/styles/global.css";

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return (
    /*providers with static data*/
    <ConfigProvider>
      <ThemeProvider includeCssBaseline={false}>
        <HubspotProvider async={false} addToHead={true}>
          {element}
        </HubspotProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};
