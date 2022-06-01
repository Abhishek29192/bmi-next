import { transformHyphens } from "@bmi/components";
import React from "react";
import { Helmet, HelmetProps } from "react-helmet";
import EffraBold from "../../static/fonts/Effra_W_Bold.woff2";
import EffraHeavy from "../../static/fonts/Effra_W_Heavy.woff2";
import EffraMedium from "../../static/fonts/Effra_W_Medium.woff2";
import EffraRegular from "../../static/fonts/Effra_W_Regular.woff2";
import { useConfig } from "../contexts/ConfigProvider";
import { getJpgImage } from "../utils/media";
import { getPathWithCountryCode } from "../utils/path";
import { createSchemaOrgDataForPdpPage } from "../utils/schemaOrgPDPpage";
import { Data as SEOContentData } from "./SEOContent";
import { Data as SiteData } from "./Site";
import { Product, VariantOption } from "./types/pim";

interface HeadProps {
  htmlAttributes: HelmetProps["htmlAttributes"];
  title: string;
  defer?: boolean;
  ogImageUrl?: string;
  scripts?: Pick<SiteData, "headScripts" | "scriptOnetrust">;
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
  const { headScripts, scriptOnetrust } = scripts;
  const {
    config: { isPreviewMode, hubSpotId, isSchemaORGActivated }
  } = useConfig();
  const imageUrl = getJpgImage(ogImageUrl);

  const isScriptOnetrustEnabled = Boolean(!isPreviewMode && scriptOnetrust);
  const enableHubSpot = Boolean(!isPreviewMode && hubSpotId);

  const schemaOrgActivated =
    Boolean(isSchemaORGActivated) &&
    Boolean(baseProduct) &&
    Boolean(variantProduct);

  return (
    <Helmet
      htmlAttributes={htmlAttributes}
      title={seo?.metaTitle || transformHyphens(title)}
      defer={defer}
    >
      <script>{`
        function detectIE() {
          if (typeof window !== "undefined" && window.location.pathname === "${getPathWithCountryCode(
            countryCode,
            "ie-dialog"
          )}") {
            return false;
          }
          var userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
          var documentMode = typeof window !== "undefined" ? window.document.documentMode : 0;
          return userAgent.indexOf("MSIE") > 0 || userAgent.indexOf("Trident") > 0 || documentMode;
        };

        if (detectIE()) {
          window.location = "${getPathWithCountryCode(
            countryCode,
            "ie-dialog"
          )}"
        }
      `}</script>
      {htmlAttributes?.lang && (
        <link
          rel="alternate"
          href={`${process.env.GATSBY_SITE_URL}${getPathWithCountryCode(
            countryCode,
            path
          )}`}
          hrefLang={htmlAttributes.lang}
        />
      )}
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

      {seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}

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
          type="text/javascript"
          src={`https://cdn.cookielaw.org/consent/${scriptOnetrust}/OtAutoBlock.js`}
        />
      )}

      {isScriptOnetrustEnabled && (
        <script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          charSet="UTF-8"
          data-domain-script={scriptOnetrust}
        />
      )}
      {isScriptOnetrustEnabled && (
        <script type="text/javascript" async>
          {`function OptanonWrapper() {}`}
        </script>
      )}

      {enableHubSpot && (
        // This script is for the HubSpot CTA Links (see `Link.tsx`)
        <script
          id="hubspot-cta-script"
          src="https://js.hscta.net/cta/current.js"
          async
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
