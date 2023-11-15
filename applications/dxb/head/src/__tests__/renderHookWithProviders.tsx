import ThemeProvider from "@bmi-digital/components/theme-provider";
import { renderHook, RenderHookResult } from "@testing-library/react";
import React from "react";
import { getMockSiteContext } from "../components/__tests__/utils/SiteContextProvider";
import { fallbackGetMicroCopy } from "../components/MicroCopy";
import { SiteContextProvider } from "../components/Site";

type RenderHookWithProviders = <P, R>(
  customHook: (...args: P[]) => R
) => RenderHookResult<R, P>;

export const renderHookWithProviders: RenderHookWithProviders = (
  customHook
) => {
  const Wrapper = ({ children }: { children: React.ReactElement }) => (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no", "no-NB"),
          homePage: {
            title: ""
          },
          getMicroCopy: fallbackGetMicroCopy
        }}
      >
        {children}
      </SiteContextProvider>
    </ThemeProvider>
  );

  return renderHook(customHook, { wrapper: Wrapper });
};
