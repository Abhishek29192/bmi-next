import React from "react";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import BackToTop from "@bmi/back-to-top";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputBanner, {
  Data as InputBannerData
} from "../components/InputBanner";
import { SiteContext, Data as SiteData } from "./Site";
import { generateGetMicroCopy } from "./MicroCopy";
import { graphql } from "gatsby";
import ErrorFallback from "./ErrorFallback";

export type Data = {
  slug: string | null;
  inputBanner: InputBannerData | null;
};

type Props = {
  children: React.ReactNode;
  title: string;
  pageData: Data;
  siteData: SiteData;
};

const Page = ({ title, children, pageData, siteData }: Props) => {
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
    scriptGTM,
    scriptHotJar
  } = siteData;

  const { inputBanner } = pageData;

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  return (
    <BmiThemeProvider>
      <Helmet title={title} defer={false}>
        {scriptGTM && (
          <script>
            {` <!-- Google Tag Manager -->
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${scriptGTM}');`}
          </script>
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

        <meta name="robots" content="noindex" />
      </Helmet>
      {scriptGTM && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${scriptGTM}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        ></noscript>
      )}

      <SiteContext.Provider
        value={{
          node_locale,
          countryCode,
          homePage: siteData.homePage,
          getMicroCopy
        }}
      >
        <Header
          navigationData={menuNavigation}
          utilitiesData={menuUtilities}
          countryCode={countryCode}
          slug={pageData.slug || undefined}
        />
        <ErrorBoundary
          fallbackRender={() => (
            <ErrorFallback
              countryCode={countryCode}
              promo={resources.errorGeneral}
            />
          )}
        >
          {children}
          {inputBanner ? <InputBanner data={inputBanner} /> : null}
        </ErrorBoundary>
        <Footer
          mainNavigation={footerMainNavigation}
          secondaryNavigation={footerSecondaryNavigation}
        />
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
    slug
    inputBanner {
      ...InputBannerFragment
    }
  }
`;
