"use client";

import React from "react";
import Script from "next/script";
import { stripIndent } from "common-tags";
import useRouteUpdate from "./useRouteUpdate";
import type { GTMParams } from "./types";

let currDataLayerName: string | undefined = undefined;

export function GoogleTagManager(props: GTMParams) {
  const {
    gtmIds,
    dataLayerName = "dataLayer",
    auth,
    preview,
    dataLayer,
    defaultDataLayer,
    includeInDevelopment = true //need to make TRUE to see the dataLayer logs
  } = props;

  if (currDataLayerName === undefined) {
    currDataLayerName = dataLayerName;
  }

  const gtmLayer = dataLayerName !== "dataLayer" ? `&l=${dataLayerName}` : "";
  const gtmAuth = auth ? `&gtm_auth=${auth}` : "";
  const gtmPreview = preview ? `&gtm_preview=${preview}&gtm_cookies_win=x` : "";

  useRouteUpdate(() => {
    // eslint-disable-next-line security/detect-object-injection
    const dataLayer = window[dataLayerName];
    dataLayer?.push({ event: "nextjs-route-change" });
  });

  if (process.env.NODE_ENV === "production" || includeInDevelopment) {
    return (
      <>
        <Script
          id="_next-gtm-init"
          data-testid="gtm-init-script"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,l){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              ${dataLayer ? `w[l].push(${JSON.stringify(dataLayer)})` : ""}
            })(window,'${dataLayerName}');`
          }}
        />

        {gtmIds.map((gtmId, index) => (
          <Script
            data-testid="gtm-scipt"
            key={`gtm-script-${index}`}
            id="_next-gtm"
            data-ntpc="GTM"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}${gtmLayer}${gtmAuth}${gtmPreview}`}
          />
        ))}

        <Script
          data-testid="gtm-plugin"
          key="plugin-google-tagmanager"
          dangerouslySetInnerHTML={{
            __html: stripIndent`
            window.${dataLayerName} = window.${dataLayerName} || [];
            function gtag(){dataLayer.push(arguments);}

            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
            window.${dataLayerName}.push(${JSON.stringify(defaultDataLayer)});
            gtag('js', new Date());
            [${gtmIds.map(
              (id) => "'" + id + "'"
            )}].forEach((id) => gtag("config", id))
          `
          }}
        />
      </>
    );
  } else {
    return null;
  }
}
