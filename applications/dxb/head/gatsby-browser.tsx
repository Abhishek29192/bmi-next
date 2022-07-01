import "./src/styles/global.css";
import React from "react";
import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import { ThemeProvider } from "@bmi/components";
import type { GatsbyBrowser } from "gatsby";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import "./src/styles/global.css";

import ComposeProviders from "./src/components/ComposeProviders";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element
}) => {
  return (
    /*providers with static data*/
    <ComposeProviders
      components={[
        (child) => <ConfigProvider>{child}</ConfigProvider>,
        (child) => (
          <ThemeProvider includeCssBaseline={false}> {child} </ThemeProvider>
        ),
        (child) => (
          <HubspotProvider async={false} addToHead={true}>
            {child}
          </HubspotProvider>
        )
      ]}
    >
      {element}
    </ComposeProviders>
  );
};
