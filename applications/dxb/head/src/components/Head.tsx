import React from "react";
import { Helmet } from "react-helmet";
import getJpgImage from "../utils/images";
import { createSchemaOrgDataForPdpPage } from "../utils/schemaOrgPDPpage";
import { useConfig } from "../contexts/ConfigProvider";
import EffraBold from "../../static/fonts/Effra_W_Bold.woff2";
import EffraHeavy from "../../static/fonts/Effra_W_Heavy.woff2";
import EffraMedium from "../../static/fonts/Effra_W_Medium.woff2";
import EffraRegular from "../../static/fonts/Effra_W_Regular.woff2";
import { Product, VariantOption } from "./types/pim";
import { Data as SEOContentData } from "./SEOContent";
import { Data as SiteData } from "./Site";

interface HeadProps {
  htmlAttributes: Record<string, string>;
  title: string;
  defer?: boolean;
  ogImageUrl?: string;
  scripts?: Pick<
    SiteData,
    | "headScripts"
    | "scriptGA"
    | "scriptOnetrust"
    | "scriptHotJar"
    | "scriptGOptLoad"
  >;
  seo?: SEOContentData | null;
  path?: string;
  baseProduct?: Product;
  variantProduct?: VariantOption;
  countryCode?: string;
}

export const Head = ({
  htmlAttributes,
  title,
  defer = false,
  ogImageUrl,
  scripts,
  seo,
  path,
  baseProduct,
  variantProduct,
  countryCode
}: HeadProps) => {
  const {
    headScripts,
    scriptOnetrust,
    scriptGA,
    scriptHotJar,
    scriptGOptLoad
  } = scripts;
  const {
    config: {
      isPreviewMode,
      googleTagManagerID,
      hubSpotId,
      isSchemaORGActivated
    }
  } = useConfig();
  const imageUrl = getJpgImage(ogImageUrl);

  //TODO: to be improved by making noindex a page level content option from Contentful
  //      for DE this will be simply a path list, hence the crude nature of below
  const noindex =
    [
      "vielen-dank!/",
      "teilnahmebedingungen/",
      "services-downloads-im-ueberblick/alle-services/alle-braas-services/schneefangberechnung/",
      "services-downloads-im-ueberblick/alle-services/alle-braas-services/windsogberechnung/windsogberechnung-tool/",
      "concrete-tiles/" // qa test page - remove before final commit
    ].indexOf(path) > -1;

  const isScriptOnetrustEnabled = Boolean(!isPreviewMode && scriptOnetrust);
  const isScriptGAenabled = Boolean(!isPreviewMode && scriptGA);
  const enableTagManagerId = Boolean(!isPreviewMode && googleTagManagerID);
  const enableHotjar = Boolean(!isPreviewMode && scriptHotJar);
  const enableGOptimize = Boolean(!isPreviewMode && scriptGOptLoad);
  const enableHubSpot = Boolean(!isPreviewMode && hubSpotId);

  const schemaOrgActivated =
    Boolean(isSchemaORGActivated) &&
    Boolean(baseProduct) &&
    Boolean(variantProduct);

  return (
    <Helmet
      htmlAttributes={htmlAttributes}
      title={seo?.metaTitle || title}
      defer={defer}
    >
      <link
        rel="preload"
        href={EffraRegular}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={EffraMedium}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={EffraHeavy}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={EffraBold}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* NOTE: expand viewport beyond safe area */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      {seo?.metaDescription && (
        <meta name="description" content={seo.metaDescription} />
      )}
      {headScripts && <script>{headScripts.headScripts}</script>}

      {isScriptOnetrustEnabled && (
        <script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          charSet="UTF-8"
          data-domain-script={scriptOnetrust}
        />
      )}
      {isScriptOnetrustEnabled && (
        <script type="text/javascript">{`function OptanonWrapper() {}`}</script>
      )}

      {enableTagManagerId && (
        <style>{`.async-hide { opacity: 0 !important}`}</style>
      )}

      {enableTagManagerId && (
        <script>{`(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
          h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
          (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
        })(window,document.documentElement,'async-hide','dataLayer',4000,
          {'${googleTagManagerID}':true});`}</script>
      )}
      {isScriptGAenabled && (
        <script>
          {`<!-- Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || []; 
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date()); gtag('config', '${scriptGA}');`}
        </script>
      )}

      {isScriptGAenabled && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${scriptGA}`}
        />
      )}

      {enableHotjar && (
        <script>
          {`<!-- Hotjar Tracking Code for https://www.bmigroup.com/no -->
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${scriptHotJar},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </script>
      )}
      {enableGOptimize && (
        <script
          async
          src={`https://www.googleoptimize.com/optimize.js?id=${scriptGOptLoad}`}
        />
      )}
      {enableHubSpot && (
        // This script is for the HubSpot CTA Links (see `Link.tsx`)
        <script
          id="hubspot-cta-script"
          src="https://js.hscta.net/cta/current.js"
        />
      )}
      <script lang="javascript">
        {`
            if(history && history.scrollRestoration && history.scrollRestoration !== 'manual') {
              history.scrollRestoration = 'manual';
            }
          `}
      </script>

      {schemaOrgActivated && (
        <script type="application/ld+json">
          {JSON.stringify(
            createSchemaOrgDataForPdpPage(
              baseProduct,
              variantProduct,
              countryCode
            )
          )}
        </script>
      )}
    </Helmet>
  );
};
