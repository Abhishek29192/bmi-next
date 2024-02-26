import { oneLine, stripIndent } from "common-tags";
import React from "react";
import type { GatsbySSR } from "gatsby";
import type { Options } from "./types";

const generateGTMIframe = (
  id: string,
  environmentParamStr: string,
  selfHostedOrigin: string
) =>
  oneLine`<iframe src="${selfHostedOrigin}/ns.html?id=${id}${environmentParamStr}" height="0" width="0" style="display: none; visibility: hidden" aria-hidden="true"></iframe>`;

export const onRenderBody: NonNullable<GatsbySSR["onRenderBody"]> = (
  { setHeadComponents, setPreBodyComponents },
  {
    ids,
    includeInDevelopment = false,
    gtmAuth,
    gtmPreview,
    defaultDataLayer,
    dataLayerName = "dataLayer",
    enableWebVitalsTracking = false,
    selfHostedOrigin = "https://www.googletagmanager.com"
  }: Options
) => {
  if (process.env.NODE_ENV === "production" || includeInDevelopment) {
    const environmentParamStr =
      gtmAuth && gtmPreview
        ? oneLine`
      &gtm_auth=${gtmAuth}&gtm_preview=${gtmPreview}&gtm_cookies_win=x
    `
        : "";

    selfHostedOrigin = selfHostedOrigin.replace(/\/$/, "");

    const inlineScripts: React.ReactNode[] = [];
    const preBodyComponents: React.ReactNode[] = [];

    if (enableWebVitalsTracking) {
      // web-vitals/polyfill (necessary for non chromium browsers)
      // @seehttps://www.npmjs.com/package/web-vitals#how-the-polyfill-works
      inlineScripts.push(
        <script
          key={`gatsby-plugin-google-tagmanager-web-vitals`}
          data-gatsby="web-vitals-polyfill"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var e,t,n,i,r={passive:!0,capture:!0},a=new Date,o=function(){i=[],t=-1,e=null,f(addEventListener)},c=function(i,r){e||(e=r,t=i,n=new Date,f(removeEventListener),u())},u=function(){if(t>=0&&t<n-a){var r={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(r)})),i=[]}},s=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){c(e,t),a()},i=function(){a()},a=function(){removeEventListener("pointerup",n,r),removeEventListener("pointercancel",i,r)};addEventListener("pointerup",n,r),addEventListener("pointercancel",i,r)}(t,e):c(t,e)}},f=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,s,r)}))},p="hidden"===document.visibilityState?0:1/0;addEventListener("visibilitychange",(function e(t){"hidden"===document.visibilityState&&(p=t.timeStamp,removeEventListener("visibilitychange",e,!0))}),!0);o(),self.webVitals={firstInputPolyfill:function(e){i.push(e),u()},resetFirstInputPolyfill:o,get firstHiddenTime(){return p}}}();
            `
          }}
        />
      );
    }

    ids.forEach((id) => {
      inlineScripts.push(
        <script
          key="plugin-google-tagmanager"
          async
          src={`${selfHostedOrigin}/gtm.js?id=${id}${
            dataLayerName !== "dataLayer" ? `&l=${dataLayerName}` : ""
          }${environmentParamStr}`}
        />
      );

      preBodyComponents.push(
        <noscript
          key="plugin-google-tagmanager"
          dangerouslySetInnerHTML={{
            __html: generateGTMIframe(id, environmentParamStr, selfHostedOrigin)
          }}
        />
      );
    });

    inlineScripts.push(
      <script
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
      [${ids.map((id) => "'" + id + "'")}].forEach((id) => gtag("config", id))
    `
        }}
      />
    );

    setHeadComponents(inlineScripts);
    setPreBodyComponents(preBodyComponents);
  }
};

export const onPreRenderHTML: NonNullable<GatsbySSR["onPreRenderHTML"]> = ({
  getHeadComponents,
  replaceHeadComponents
}) => {
  const headComponents = getHeadComponents() as React.ReactElement[];
  //Needed to make sure that gtag scripts are being loaded at the very beginning
  //In order setup default consent rules
  headComponents.sort((a, b) => {
    if (
      a.key !== "plugin-google-tagmanager" &&
      b.key === "plugin-google-tagmanager"
    ) {
      return 1;
    }

    if (
      a.key === "plugin-google-tagmanager" &&
      b.key !== "plugin-google-tagmanager"
    ) {
      return -1;
    }

    return 0;
  });
  replaceHeadComponents(headComponents);
};
