import React from "react";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import BackToTop from "@bmi/back-to-top";
import MicroCopy from "@bmi/micro-copy";
import { graphql, navigate } from "gatsby";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputBanner, {
  Data as InputBannerData
} from "../components/InputBanner";
import getJpgImage from "../utils/images";
import { getPathWithCountryCode } from "../utils/path";
import { createSchemaOrgDataForPdpPage } from "../utils/schemaOrgPDPpage";
import { BasketContextProvider } from "../contexts/SampleBasketContext";
import BrandProvider from "./BrandProvider";
import {
  SiteContextProvider,
  Data as SiteData,
  useSiteContext,
  Context as SiteContext
} from "./Site";
import { Data as BreadcrumbsData } from "./Breadcrumbs";
import { generateGetMicroCopy } from "./MicroCopy";
import ErrorFallback from "./ErrorFallback";
import { Data as SEOContentData } from "./SEOContent";
import VisualiserProvider from "./Visualiser";
import Calculator from "./PitchedRoofCalcualtor";
import { Product, VariantOption } from "./types/pim";

export type Data = {
  breadcrumbs: BreadcrumbsData | null;
  inputBanner: InputBannerData | null;
  seo: SEOContentData | null;
  path: string;
};

type Context = {
  siteContext: SiteContext;
};

type Children = React.ReactNode | ((context: Context) => React.ReactNode);

type Props = {
  brand?: string;
  children: Children;
  title: string;
  pageData: Data;
  siteData: SiteData;
  isSearchPage?: boolean;
  variantCodeToPathMap?: Record<string, string>;
  ogImageUrl?: string;
  baseproduct?: Product;
  variantProduct?: VariantOption;
};

const Content = ({ children }: { children: Children }) => {
  const siteContext = useSiteContext();

  return typeof children === "function" ? children({ siteContext }) : children;
};

const Page = ({
  brand,
  title,
  children,
  pageData,
  siteData,
  isSearchPage,
  variantCodeToPathMap,
  ogImageUrl,
  baseproduct,
  variantProduct
}: Props) => {
  const {
    node_locale,
    countryCode,
    footerMainNavigation,
    footerSecondaryNavigation,
    menuNavigation,
    menuUtilities,
    resources,
    headScripts,
    scriptGA,
    scriptOnetrust,
    scriptHotJar,
    scriptGOptLoad,
    regions
  } = siteData;

  const { breadcrumbs, inputBanner, seo, path } = pageData;

  const reCaptchaKey =
    !process.env.GATSBY_PREVIEW && process.env.GATSBY_RECAPTCHA_KEY;
  const reCaptchaNet =
    !process.env.GATSBY_PREVIEW && process.env.GATSBY_RECAPTCHA_NET === "true";

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  const imageUrl = getJpgImage(ogImageUrl);

  const enableOnetrust = Boolean(!process.env.GATSBY_PREVIEW && scriptOnetrust);
  const enableGA = Boolean(!process.env.GATSBY_PREVIEW && scriptGA);
  const enableTagManagerId = Boolean(
    !process.env.GATSBY_PREVIEW && process.env.GOOGLE_TAGMANAGER_ID
  );
  const enableHotjar = Boolean(!process.env.GATSBY_PREVIEW && scriptHotJar);
  const enableGOptimize = Boolean(
    !process.env.GATSBY_PREVIEW && scriptGOptLoad
  );
  const enableHubSpot = Boolean(
    !process.env.GATSBY_PREVIEW && process.env.GATSBY_HUBSPOT_ID
  );

  const siteContext = {
    node_locale,
    countryCode,
    homePage: siteData.homePage,
    getMicroCopy,
    reCaptchaKey,
    reCaptchaNet
  };

  const microCopyContext = resources?.microCopy.reduce(
    (carry, { key, value }) => ({
      ...carry,
      [key]: value
    }),
    {}
  );

  //TODO: to be improved by making noindex a page level content option from Contentful
  //      for DE this will be simply a path list, hence the crude nature of below
  const noindex =
    [
      //DE
      "vielen-dank/",
      "teilnahmebedingungen/",
      "services-downloads-im-ueberblick/alle-services/alle-braas-services/schneefangberechnung/",
      "services-downloads-im-ueberblick/alle-services/alle-braas-services/windsogberechnung/windsogberechnung-tool/",
      //FR
      "professionnels/iaodc1artv2l5y7e/",
      "professionnels/rgga23impm0om5rcs/"
    ].indexOf(path) > -1;

  const schemaOrgActivated =
    Boolean(process.env.GATSBY_SCHEMA_ORG_ACTIVATED) &&
    Boolean(baseproduct) &&
    Boolean(variantProduct);

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: node_locale }}
        title={seo?.metaTitle || title}
        defer={false}
      >
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

        {enableOnetrust && (
          <script
            type="text/javascript"
            src={`https://cdn.cookielaw.org/consent/${scriptOnetrust}/OtAutoBlock.js`}
          />
        )}
        {enableOnetrust && (
          <script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            charSet="UTF-8"
            data-domain-script={scriptOnetrust}
          />
        )}
        {enableOnetrust && (
          <script type="text/javascript">
            {`function OptanonWrapper() {}`}
          </script>
        )}

        {enableTagManagerId && (
          <style>{`.async-hide { opacity: 0 !important}`}</style>
        )}

        {enableTagManagerId && (
          <script>{`(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
          h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
          (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
        })(window,document.documentElement,'async-hide','dataLayer',4000,
          {'${process.env.GOOGLE_TAGMANAGER_ID}':true});`}</script>
        )}
        {enableGA && (
          <script>
            {`<!-- Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || []; 
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date()); gtag('config', '${scriptGA}');`}
          </script>
        )}

        {enableGA && (
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
                baseproduct,
                variantProduct,
                countryCode
              )
            )}
          </script>
        )}
      </Helmet>

      <SiteContextProvider value={siteContext}>
        <MicroCopy.Provider values={microCopyContext}>
          <BasketContextProvider>
            <GoogleReCaptchaProvider
              reCaptchaKey={reCaptchaKey}
              useRecaptchaNet={reCaptchaNet}
              language={countryCode}
            >
              <BmiThemeProvider>
                <Header
                  navigationData={menuNavigation}
                  utilitiesData={menuUtilities}
                  countryCode={countryCode}
                  activeLabel={
                    (breadcrumbs && breadcrumbs[0]?.label) || undefined
                  }
                  isOnSearchPage={isSearchPage}
                  countryNavigationIntroduction={
                    resources?.countryNavigationIntroduction
                  }
                  regions={regions}
                  sampleBasketLink={resources?.sampleBasketLink}
                />
              </BmiThemeProvider>
              <BrandProvider brand={brand}>
                <ErrorBoundary
                  fallbackRender={() => (
                    <ErrorFallback
                      countryCode={countryCode}
                      promo={resources.errorGeneral}
                    />
                  )}
                  onError={() =>
                    navigate(getPathWithCountryCode(countryCode, "422"))
                  }
                >
                  <VisualiserProvider
                    contentSource={process.env.GATSBY_VISUALISER_ASSETS_URL}
                    variantCodeToPathMap={variantCodeToPathMap}
                    shareWidgetData={resources?.visualiserShareWidget}
                  >
                    <Calculator
                      onError={() =>
                        navigate(getPathWithCountryCode(countryCode, "422"))
                      }
                    >
                      <Content>{children}</Content>
                    </Calculator>
                  </VisualiserProvider>
                  {inputBanner ? <InputBanner data={inputBanner} /> : null}
                </ErrorBoundary>
              </BrandProvider>
              <BmiThemeProvider>
                <Footer
                  mainNavigation={footerMainNavigation}
                  secondaryNavigation={footerSecondaryNavigation}
                />
                <BackToTop accessibilityLabel="Back to the top" />
              </BmiThemeProvider>
            </GoogleReCaptchaProvider>
          </BasketContextProvider>
        </MicroCopy.Provider>
      </SiteContextProvider>
    </>
  );
};

const FallbackComponent = () => (
  <div role="alert">
    It&#39;s not you, it&#39;s us - something went wrong on our web server.
  </div>
);

export default withErrorBoundary(Page, {
  FallbackComponent: FallbackComponent
  // Possible to log errors with onError method
});

export const query = graphql`
  fragment PageFragment on ContentfulPage {
    breadcrumbs
    inputBanner {
      ...InputBannerFragment
    }
    seo {
      ...SEOContentFragment
    }
    path
  }
`;
