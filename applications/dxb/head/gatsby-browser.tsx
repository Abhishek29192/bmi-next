import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import { ThemeProvider } from "@bmi-digital/components";
import { CacheProvider } from "@emotion/react";
import type { GatsbyBrowser } from "gatsby";
import React from "react";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import "./src/styles/global.css";
import cache from "./src/get-emotion-cache";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element
}) => {
  return (
    /*providers with static data*/
    <ConfigProvider>
      <CacheProvider value={cache}>
        <ThemeProvider includeCssBaseline={false}>
          <HubspotProvider async={false} addToHead={true}>
            {element}
          </HubspotProvider>
        </ThemeProvider>
      </CacheProvider>
    </ConfigProvider>
  );
};
