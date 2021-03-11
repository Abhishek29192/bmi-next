import React from "react";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import BackToTop from "@bmi/back-to-top";
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
};

const Page = ({ title, children, pageData, siteData, isSearchPage }: Props) => {
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
    scriptGRecaptchaId,
    scriptGRecaptchaNet
  } = siteData;

  const { breadcrumbs, inputBanner, seo } = pageData;

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  return (
    <BmiThemeProvider>
      <Helmet
        htmlAttributes={{ lang: node_locale }}
        title={seo?.metaTitle || title}
        defer={false}
      >
        {seo?.metaDescription && (
          <meta name="description" content={seo.metaDescription} />
        )}

        {headScripts && <script>{headScripts.headScripts}</script>}
        {scriptOnetrust && (
          <script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            charSet="UTF-8"
            data-domain-script={scriptOnetrust}
          ></script>
        )}
        {scriptOnetrust && (
          <script type="text/javascript">
            {`function OptanonWrapper() {}`}
          </script>
        )}
        {scriptGA && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${scriptGA}`}
          ></script>
        )}
        {scriptGA && (
          <script>
            {`<!-- Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || []; 
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date()); gtag('config', '${scriptGA}');`}
          </script>
        )}

        {scriptHotJar && (
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
        {scriptGOptLoad && (
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
          scriptGRecaptchaId,
          scriptGRecaptchaNet
        }}
      >
        <GoogleReCaptchaProvider
          reCaptchaKey={scriptGRecaptchaId}
          useRecaptchaNet={scriptGRecaptchaNet}
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
            <div className={styles["content"]}>{children}</div>
            {inputBanner ? <InputBanner data={inputBanner} /> : null}
          </ErrorBoundary>
          <Footer
            mainNavigation={footerMainNavigation}
            secondaryNavigation={footerSecondaryNavigation}
          />
        </GoogleReCaptchaProvider>
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
