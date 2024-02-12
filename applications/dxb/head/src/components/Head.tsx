import { transformHyphens } from "@bmi-digital/components/utils";
import React from "react";
import { Helmet } from "react-helmet";
import EffraBold from "../../static/fonts/Effra_W_Bold.woff2";
import EffraHeavy from "../../static/fonts/Effra_W_Heavy.woff2";
import EffraMedium from "../../static/fonts/Effra_W_Medium.woff2";
import EffraRegular from "../../static/fonts/Effra_W_Regular.woff2";
import { useConfig } from "../contexts/ConfigProvider";
import { Product } from "../types/pim";
import { getJpgImage } from "../utils/media";
import { getPathWithCountryCode } from "../utils/path";
import { createSchemaOrgForHomeAndBrandPage } from "../utils/schemaOrgHomeAndBrandPage";
import { createSchemaOrgDataForPdpPage } from "../utils/schemaOrgPDPpage";
import { Data as SEOContentData } from "./SEOContent";

interface HeadProps {
  htmlAttributes: { lang: string };
  title: string;
  defer?: boolean;
  ogImageUrl?: string;
  seo: SEOContentData | null;
  path: string;
  variantProduct?: Product;
  countryCode?: string;
  pageType?: string;
  brandLogo?: string | null;
}

export const Head = ({
  htmlAttributes,
  title,
  defer = false,
  ogImageUrl,
  seo,
  path,
  variantProduct,
  countryCode,
  pageType,
  brandLogo
}: HeadProps) => {
  const {
    excludeLocalisedAlternate,
    isPreviewMode,
    hubSpotId,
    isSchemaORGActivated,
    oneTrustId
  } = useConfig();
  const imageUrl = getJpgImage(ogImageUrl);

  const isScriptOnetrustEnabled = Boolean(oneTrustId);
  const enableHubSpot = Boolean(!isPreviewMode && hubSpotId);

  const schemaOrgActivated =
    Boolean(isSchemaORGActivated) && Boolean(variantProduct);

  const seoDescription =
    (variantProduct &&
      (variantProduct.seoDescription || variantProduct.description)) ||
    (seo && seo.metaDescription);

  const correctGatsbySiteUrl: string = process.env.GATSBY_SITE_URL!.endsWith(
    "/"
  )
    ? process.env.GATSBY_SITE_URL!.slice(0, -1)
    : process.env.GATSBY_SITE_URL!;
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
      {!excludeLocalisedAlternate && htmlAttributes.lang && (
        <link
          rel="alternate"
          href={`${correctGatsbySiteUrl}${getPathWithCountryCode(
            countryCode,
            path
          )}`}
          hrefLang={htmlAttributes.lang}
        />
      )}
      <link
        rel="alternate"
        href={`${correctGatsbySiteUrl}${getPathWithCountryCode(
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

      {schemaOrgActivated && (
        <script type="application/ld+json">
          {JSON.stringify(
            createSchemaOrgDataForPdpPage(
              correctGatsbySiteUrl,
              variantProduct,
              countryCode
            )
          )}
        </script>
      )}
      {!!pageType && (
        <script type="application/ld+json">
          {JSON.stringify(
            createSchemaOrgForHomeAndBrandPage(
              correctGatsbySiteUrl,
              pageType,
              htmlAttributes.lang,
              path,
              title,
              countryCode,
              seo?.metaDescription || undefined,
              brandLogo || undefined,
              seo?.sameAs || undefined
            )
          )}
        </script>
      )}
    </Helmet>
  );
};
