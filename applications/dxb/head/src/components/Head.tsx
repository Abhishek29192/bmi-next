import { transformHyphens } from "@bmi-digital/components";
import React from "react";
import { Helmet, HelmetProps } from "react-helmet";
import EffraBold from "../../static/fonts/Effra_W_Bold.woff2";
import EffraHeavy from "../../static/fonts/Effra_W_Heavy.woff2";
import EffraMedium from "../../static/fonts/Effra_W_Medium.woff2";
import EffraRegular from "../../static/fonts/Effra_W_Regular.woff2";
import { useConfig } from "../contexts/ConfigProvider";
import { Product } from "../types/pim";
import { getJpgImage } from "../utils/media";
import { getPathWithCountryCode } from "../utils/path";
import { createSchemaOrgDataForPdpPage } from "../utils/schemaOrgPDPpage";
import { Data as SEOContentData } from "./SEOContent";
import { Data as SiteData } from "./Site";

interface HeadProps {
  htmlAttributes: HelmetProps["htmlAttributes"];
  title: string;
  defer?: boolean;
  ogImageUrl?: string;
  scripts?: Pick<SiteData, "headScripts">;
  seo: SEOContentData | null;
  path: string | null;
  variantProduct?: Product;
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
  variantProduct,
  countryCode
}: HeadProps) => {
  const { headScripts } = scripts;
  const { isPreviewMode, hubSpotId, isSchemaORGActivated, oneTrustId } =
    useConfig();
  const imageUrl = getJpgImage(ogImageUrl);

  const isScriptOnetrustEnabled = Boolean(!isPreviewMode && oneTrustId);
  const enableHubSpot = Boolean(!isPreviewMode && hubSpotId);

  const schemaOrgActivated =
    Boolean(isSchemaORGActivated) && Boolean(variantProduct);

  const seoDescription =
    (variantProduct &&
      (variantProduct.seoDescription || variantProduct.description)) ||
    (seo && seo.metaDescription);
  return (
    <Helmet
      htmlAttributes={htmlAttributes}
      title={seo?.metaTitle || (transformHyphens(title) as string)}
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
        rel="alternate"
        href={`${process.env.GATSBY_SITE_URL}${getPathWithCountryCode(
          countryCode,
          path
        )}`}
        hrefLang="x-default"
      />
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
      {imageUrl && (
        <meta
          property="og:image"
          content={imageUrl}
          data-testid={"meta-og-image"}
        />
      )}

      {seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* NOTE: expand viewport beyond safe area */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      {!!seoDescription && <meta name="description" content={seoDescription} />}
      {variantProduct?.seoTags && (
        <meta name="keywords" content={variantProduct.seoTags.join(",")} />
      )}
      {isScriptOnetrustEnabled && (
        <script
          type="text/javascript"
          src={`https://cdn.cookielaw.org/consent/${oneTrustId}/OtAutoBlock.js`}
        />
      )}

      {isScriptOnetrustEnabled && (
        <script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          data-domain-script={oneTrustId}
        />
      )}
      {isScriptOnetrustEnabled && (
        <script type="text/javascript">{`
              function OptanonWrapper() { 
                  console.log("OptanonWrapper called");
              }
        `}</script>
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

      {headScripts && <script>{headScripts.headScripts}</script>}

      {schemaOrgActivated && (
        <script type="application/ld+json">
          {JSON.stringify(
            createSchemaOrgDataForPdpPage(variantProduct, countryCode)
          )}
        </script>
      )}
    </Helmet>
  );
};
