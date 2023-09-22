import React from "react";
import { oneLine, stripIndent } from "common-tags";
import type { GatsbySSR } from "gatsby";
import type { Options } from "./types";

const generateGTM = (
  id: string,
  environmentParamStr: string,
  dataLayerName: string,
  selfHostedOrigin: string
) => stripIndent`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  '${selfHostedOrigin}/gtm.js?id='+i+dl+'${environmentParamStr}';f.parentNode.insertBefore(j,f);
  })(window,document,'script','${dataLayerName}', '${id}');`;

const generateGTMIframe = (
  id: string,
  environmentParamStr: string,
  selfHostedOrigin: string
) =>
  oneLine`<iframe src="${selfHostedOrigin}/ns.html?id=${id}${environmentParamStr}" height="0" width="0" style="display: none; visibility: hidden" aria-hidden="true"></iframe>`;

const generateDefaultDataLayer = (
  defaultDataLayer: NonNullable<Options["defaultDataLayer"]>,
  dataLayerName: string
) => {
  let result = `window.${dataLayerName} = window.${dataLayerName} || [];`;

  if (defaultDataLayer.type === "function") {
    result += `window.${dataLayerName}.push((${defaultDataLayer.value})());`;
  } else {
    if (
      defaultDataLayer.type !== "object" ||
      defaultDataLayer.value.constructor !== Object
    ) {
      throw new Error(
        `Oops the plugin option "defaultDataLayer" should be a plain object. "${defaultDataLayer}" is not valid.`
      );
    }

    result += `window.${dataLayerName}.push(${JSON.stringify(
      defaultDataLayer.value
    )});`;
  }

  return stripIndent`${result}`;
};

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

    let defaultDataLayerCode = "";
    if (defaultDataLayer) {
      defaultDataLayerCode = generateDefaultDataLayer(
        defaultDataLayer,
        dataLayerName
      );
    }

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
          dangerouslySetInnerHTML={{
            __html: oneLine`
          ${defaultDataLayerCode}
          ${generateGTM(
            id,
            environmentParamStr,
            dataLayerName,
            selfHostedOrigin
          )}`
          }}
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

    setHeadComponents(inlineScripts);
    setPreBodyComponents(preBodyComponents);
  }
};
