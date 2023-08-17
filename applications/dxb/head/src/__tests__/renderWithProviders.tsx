import { render } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { fallbackGetMicroCopy } from "../components/MicroCopy";
import {
  SiteContextProvider,
  Context as SiteContextType
} from "../components/Site";
import { getMockSiteContext } from "../components/__tests__/utils/SiteContextProvider";

export const renderWithProviders = (
  component: React.ReactElement,
  siteContext: Partial<SiteContextType> = {}
) =>
  render(
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no", "no-NB"),
          homePage: {
            title: ""
          },
          getMicroCopy: fallbackGetMicroCopy,
          ...siteContext
        }}
      >
        {component}
      </SiteContextProvider>
    </ThemeProvider>
  );
