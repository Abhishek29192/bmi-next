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
import { SiteContext, Data as SiteData } from "./Site";
import { Data as BreadcrumbsData } from "./Breadcrumbs";
import { generateGetMicroCopy } from "./MicroCopy";
import ErrorFallback from "./ErrorFallback";
import { Data as SEOContentData } from "./SEOContent";
import VisualiserProvider from "./Visualiser";
import Calculator from "./PitchedRoofCalcualtor";
import styles from "./styles/Page.module.scss";

export type Data = {
  breadcrumbs: BreadcrumbsData | null;
  inputBanner: InputBannerData | null;
  seo: SEOContentData | null;
};

type Props = {
  children: React.ReactNode;
  title: string;
  pageData: Data;
  siteData: SiteData;
  isSearchPage?: boolean;
  variantCodeToPathMap?: Record<string, string>;
  ogImageUrl?: string;
};

const Page = ({
  title,
  children,
  pageData,
  siteData,
  isSearchPage,
  variantCodeToPathMap,
  ogImageUrl
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
    scriptGOptLoad
  } = siteData;

  const { breadcrumbs, inputBanner, seo } = pageData;

  const reCaptchaKey = !process.env.GATSBY_PREVIEW && process.env.RECAPTCHA_KEY;
  const recaptchaNet =
    !process.env.GATSBY_PREVIEW && process.env.RECAPTCHA_NET === "true";

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  return (
    <BmiThemeProvider longText={!!process.env.GATSBY_LONG_TEXT}>
      <Helmet
        htmlAttributes={{ lang: node_locale }}
        title={seo?.metaTitle || title}
        defer={false}
      >
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

        {/* NOTE: expand viewport beyond safe area */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        {seo?.metaDescription && (
          <meta name="description" content={seo.metaDescription} />
        )}
        {headScripts && <script>{headScripts.headScripts}</script>}

        {!process.env.GATSBY_PREVIEW && scriptOnetrust && (
          <script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            charSet="UTF-8"
            data-domain-script={scriptOnetrust}
          ></script>
        )}
        {!process.env.GATSBY_PREVIEW && scriptOnetrust && (
          <script type="text/javascript">
            {`function OptanonWrapper() {}`}
          </script>
        )}
        {!process.env.GATSBY_PREVIEW && scriptGA && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${scriptGA}`}
          ></script>
        )}
        {!process.env.GATSBY_PREVIEW && scriptGA && (
          <script>
            {`<!-- Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || []; 
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date()); gtag('config', '${scriptGA}');`}
          </script>
        )}

        {!process.env.GATSBY_PREVIEW && scriptHotJar && (
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
        {!process.env.GATSBY_PREVIEW && scriptGOptLoad && (
          <script
            async
            src={`https://www.googleoptimize.com/optimize.js?id=${scriptGOptLoad}`}
          ></script>
        )}
      </Helmet>

      <SiteContext.Provider
        value={{
          node_locale,
          countryCode,
          homePage: siteData.homePage,
          getMicroCopy,
          reCaptchaKey,
          recaptchaNet
        }}
      >
        <MicroCopy.Provider
          values={resources?.microCopy.reduce(
            (carry, { key, value }) => ({
              ...carry,
              [key]: value
            }),
            {}
          )}
        >
          <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaKey}
            useRecaptchaNet={recaptchaNet}
            language={countryCode}
          >
            <Header
              navigationData={menuNavigation}
              utilitiesData={menuUtilities}
              countryCode={countryCode}
              activeLabel={(breadcrumbs && breadcrumbs[0]?.label) || undefined}
              isOnSearchPage={isSearchPage}
            />
            <ErrorBoundary
              fallbackRender={() => (
                <ErrorFallback
                  countryCode={countryCode}
                  promo={resources.errorGeneral}
                />
              )}
              onError={() => navigate(`/${countryCode}/422`)}
            >
              <VisualiserProvider
                contentSource={process.env.GATSBY_VISUALISER_ASSETS_URL}
                variantCodeToPathMap={variantCodeToPathMap}
                shareWidgetData={resources?.visualiserShareWidget}
              >
                <Calculator>
                  <div className={styles["content"]}>{children}</div>
                </Calculator>
              </VisualiserProvider>
              {inputBanner ? <InputBanner data={inputBanner} /> : null}
            </ErrorBoundary>
            <Footer
              mainNavigation={footerMainNavigation}
              secondaryNavigation={footerSecondaryNavigation}
            />
          </GoogleReCaptchaProvider>
        </MicroCopy.Provider>
      </SiteContext.Provider>
      <BackToTop accessibilityLabel="Back to the top" />
    </BmiThemeProvider>
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
  }
`;
