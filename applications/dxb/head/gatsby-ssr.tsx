import { ThemeProvider } from "@bmi/components";
import { HubspotProvider } from "@aaronhayes/react-use-hubspot-form";
import type { GatsbySSR } from "gatsby";
import React from "react";
import ComposeProviders from "./src/components/ComposeProviders";
import { ConfigProvider } from "./src/contexts/ConfigProvider";
import { BasketContextProvider } from "./src/contexts/SampleBasketContext";
import "./src/styles/global.css";

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return (
    /*providers with static data*/
    <ComposeProviders
      components={[
        (child) => <ConfigProvider>{child}</ConfigProvider>,
        (child) => (
          <ThemeProvider includeCssBaseline={false}> {child} </ThemeProvider>
        ),
        (child) => <BasketContextProvider>{child}</BasketContextProvider>,
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
