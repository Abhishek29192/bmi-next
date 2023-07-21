import { renderHook, RenderHookResult } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { fallbackGetMicroCopy } from "../components/MicroCopy";
import { SiteContextProvider } from "../components/Site";
import { getMockSiteContext } from "../components/__tests__/utils/SiteContextProvider";

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
