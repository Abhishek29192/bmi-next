import { render } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { fallbackGetMicroCopy } from "../components/MicroCopy";
import { SiteContextProvider } from "../components/Site";

export const renderWithProviders = (component: React.ReactElement) =>
  render(
    <ThemeProvider>
      <SiteContextProvider
        value={{
          countryCode: "no",
          node_locale: "no-NB",
          homePage: {
            title: ""
          },
          getMicroCopy: fallbackGetMicroCopy
        }}
      >
        {component}
      </SiteContextProvider>
    </ThemeProvider>
  );
