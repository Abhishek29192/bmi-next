import React from "react";
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
    <html lang="en">
      <GoogleTagManager
        gtmIds={gtmIds}
        defaultDataLayer={{
          platform: "nextjs",
          env: process.env.NODE_ENV
        }}
      />
      <body>{children}</body>
    </html>
  );
}
