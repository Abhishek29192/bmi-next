import { BackToTop, MicroCopy } from "@bmi/components";
import { graphql, navigate } from "gatsby";
import React from "react";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "../../src/styles/fonts.module.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getPathWithCountryCode } from "../utils/path";
import { useConfig } from "../contexts/ConfigProvider";
import { Product } from "../types/pim";
import { BasketContextProvider } from "../contexts/SampleBasketContext";
import SignupBlock, { Data as SignupBlockData } from "./SignupBlock";
import BrandProvider from "./BrandProvider";
import { Data as BreadcrumbsData } from "./Breadcrumbs";
import ErrorFallback from "./ErrorFallback";
import { generateGetMicroCopy } from "./MicroCopy";
import { Data as SEOContentData } from "./SEOContent";
import {
  Context as SiteContext,
  Data as SiteData,
  SiteContextProvider,
  useSiteContext
} from "./Site";
import VisualiserProvider from "./Visualiser";
import Calculator from "./PitchedRoofCalcualtor";
import "../../src/styles/fonts.module.scss";
import { Head } from "./Head";
import ComposeProviders from "./ComposeProviders";

export type Data = {
  breadcrumbs: BreadcrumbsData | null;
  signupBlock: SignupBlockData | null;
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
  variantProduct?: Product;
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
    regions
  } = siteData;

  const { breadcrumbs, signupBlock, seo, path } = pageData;
  const {
    config: { gatsbyReCaptchaKey, gatsbyReCaptchaNet, visualizerAssetUrl }
  } = useConfig();
  const reCaptchaNet = gatsbyReCaptchaNet === "true";

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  const siteContext = {
    node_locale,
    countryCode,
    homePage: siteData.homePage,
    getMicroCopy,
    gatsbyReCaptchaKey,
    reCaptchaNet
  };

  const microCopyContext = resources?.microCopy.reduce(
    (carry, { key, value }) => ({
      ...carry,
      [key]: value
    }),
    {}
  );

  return (
    <>
      <Head
        htmlAttributes={{ lang: node_locale }}
        title={title}
        defer={false}
        ogImageUrl={ogImageUrl}
        scripts={{
          headScripts
        }}
        path={path}
        seo={seo}
        variantProduct={variantProduct}
        countryCode={countryCode}
      />
      <ComposeProviders
        components={[
          (child) => (
            <SiteContextProvider value={siteContext}>
              {child}
            </SiteContextProvider>
          ),
          (child) => <BasketContextProvider>{child}</BasketContextProvider>,
          (child) => (
            <MicroCopy.Provider values={microCopyContext}>
              {child}
            </MicroCopy.Provider>
          ),
          (child) => (
            <GoogleReCaptchaProvider
              reCaptchaKey={gatsbyReCaptchaKey}
              useRecaptchaNet={reCaptchaNet}
              language={countryCode}
            >
              {child}
            </GoogleReCaptchaProvider>
          ),
          (child) => <BrandProvider brand={brand}>{child}</BrandProvider>,
          (child) => (
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
              {child}
            </ErrorBoundary>
          ),
          (child) => (
            <VisualiserProvider
              contentSource={visualizerAssetUrl}
              variantCodeToPathMap={variantCodeToPathMap}
              shareWidgetData={resources?.visualiserShareWidget}
            >
              {child}
            </VisualiserProvider>
          )
        ]}
      >
        <Header
          navigationData={menuNavigation}
          utilitiesData={menuUtilities}
          countryCode={countryCode}
          activeLabel={(breadcrumbs && breadcrumbs[0]?.label) || undefined}
          isOnSearchPage={isSearchPage}
          countryNavigationIntroduction={
            resources?.countryNavigationIntroduction
          }
          regions={regions}
          sampleBasketLink={resources?.sampleBasketLink}
          maximumSamples={resources?.maximumSamples}
        />
        <Calculator
          onError={() => navigate(getPathWithCountryCode(countryCode, "422"))}
        >
          <Content>{children}</Content>
        </Calculator>
        {signupBlock ? <SignupBlock data={signupBlock} /> : null}
        <Footer
          mainNavigation={footerMainNavigation}
          secondaryNavigation={footerSecondaryNavigation}
        />
        <BackToTop accessibilityLabel="Back to the top" />
      </ComposeProviders>
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
    signupBlock {
      ...SignupBlockFragment
    }
    seo {
      ...SEOContentFragment
    }
    path
  }
`;
