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
    resources
  } = siteData;

  const { inputBanner } = pageData;

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  return (
    <BmiThemeProvider>
      <Helmet title={title} />
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
