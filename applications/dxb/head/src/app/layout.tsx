"use client";

import React from "react";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ConfigProvider } from "../contexts/ConfigProvider";
import { theme } from "../styles/modifyTheme";
import { GoogleTagManager } from "../components/gtm";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const gtmIds = [
    process.env.GOOGLE_TAGMANAGER_ID,
    process.env.GOOGLE_TAGMANAGER_MARKET_MEDIA_ID
  ];
  return (
    <html lang={process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!}>
      <GoogleTagManager
        gtmIds={gtmIds}
        defaultDataLayer={{
          platform: "nextjs",
          env: process.env.NODE_ENV
        }}
      />
      <body>
        <AppRouterCacheProvider>
          <ConfigProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </ConfigProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
