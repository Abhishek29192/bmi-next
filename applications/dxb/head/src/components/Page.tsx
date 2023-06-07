import { BackToTop, MicroCopy } from "@bmi-digital/components";
import { graphql, navigate } from "gatsby";
import React from "react";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "../../src/styles/fonts.module.scss";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useConfig } from "../contexts/ConfigProvider";
import { BasketContextProvider } from "../contexts/SampleBasketContext";
import { Product } from "../types/pim";
import { getPathWithCountryCode } from "../utils/path";
import BrandProvider from "./BrandProvider";
import { Data as BreadcrumbsData } from "./Breadcrumbs";
import ErrorFallback from "./ErrorFallback";
import FallbackComponent from "./FallbackComponent";
import { Head } from "./Head";
import { generateGetMicroCopy } from "./MicroCopy";
import CalculatorProvider from "./PitchedRoofCalcualtor";
import { Data as SEOContentData } from "./SEOContent";
import SignupBlock, { Data as SignupBlockData } from "./SignupBlock";
import {
  Context as SiteContext,
  SiteContextProvider,
  Data as SiteData,
  useSiteContext
} from "./Site";
import VisualiserProvider from "./Visualiser";

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
  disableSearch?: boolean;
  variantCodeToPathMap?: Record<string, string>;
  ogImageUrl?: string;
  variantProduct?: Product;
};

const Content = ({ children }: { children: Children }) => {
  const siteContext = useSiteContext();

  return (
    <>{typeof children === "function" ? children({ siteContext }) : children}</>
  );
};

const Page = ({
  brand,
  title,
  children,
  pageData,
  siteData,
  disableSearch,
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
    regions,
    pitchedRoofCalculatorConfig,
    visualiserHouseTypes
  } = siteData;

  const { breadcrumbs, signupBlock, seo, path } = pageData;
  const {
    gatsbyReCaptchaKey,
    gatsbyReCaptchaNet,
    visualizerAssetUrl,
    isSpaEnabled
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

  const microCopyContext = resources?.microCopy?.reduce(
    (carry, { key, value }) => ({
      ...carry,
      [key]: value
    }),
    {}
  );

  const seoTitle =
    variantProduct && variantProduct.seoTitle
      ? variantProduct.seoTitle
      : title || "";

  return (
    <>
      <Head
        htmlAttributes={{ lang: node_locale }}
        title={seoTitle}
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
      <SiteContextProvider value={siteContext}>
        <BasketContextProvider>
          <MicroCopy.Provider values={microCopyContext}>
            <GoogleReCaptchaProvider
              reCaptchaKey={gatsbyReCaptchaKey}
              useRecaptchaNet={reCaptchaNet}
              language={countryCode}
            >
              <ErrorBoundary
                fallbackRender={() => (
                  <ErrorFallback
                    countryCode={countryCode}
                    promo={resources?.errorGeneral}
                  />
                )}
                onError={() =>
                  navigate(getPathWithCountryCode(countryCode, "422"))
                }
              >
                <Header
                  navigationData={menuNavigation}
                  utilitiesData={menuUtilities}
                  countryCode={countryCode}
                  lastNavigationLabel={
                    (breadcrumbs &&
                      breadcrumbs[breadcrumbs.length - 1].label) ||
                    undefined
                  }
                  activeLabel={
                    (breadcrumbs && breadcrumbs[0]?.label) || undefined
                  }
                  disableSearch={disableSearch}
                  countryNavigationIntroduction={
                    resources?.countryNavigationIntroduction
                  }
                  regions={regions}
                  sampleBasketLink={resources?.sampleBasketLink}
                  maximumSamples={resources?.maximumSamples}
                />
                <VisualiserProvider
                  contentSource={visualizerAssetUrl}
                  variantCodeToPathMap={variantCodeToPathMap}
                  shareWidgetData={resources?.visualiserShareWidget}
                  houseTypes={visualiserHouseTypes}
                >
                  <CalculatorProvider
                    onError={() =>
                      navigate(getPathWithCountryCode(countryCode, "422"))
                    }
                    calculatorConfig={pitchedRoofCalculatorConfig}
                  >
                    <BrandProvider brand={brand}>
                      <Content>{children}</Content>
                    </BrandProvider>
                  </CalculatorProvider>
                  {signupBlock && !isSpaEnabled ? (
                    <SignupBlock data={signupBlock} />
                  ) : null}
                  <Footer
                    mainNavigation={footerMainNavigation}
                    secondaryNavigation={footerSecondaryNavigation}
                  />
                  <BackToTop accessibilityLabel="Back to the top" />
                </VisualiserProvider>
              </ErrorBoundary>
            </GoogleReCaptchaProvider>
          </MicroCopy.Provider>
        </BasketContextProvider>
      </SiteContextProvider>
    </>
  );
};

export default withErrorBoundary(Page, {
  FallbackComponent: FallbackComponent
  // Possible to log errors with onError method
});

export const query = graphql`
  fragment PageFragment on ContentfulPage {
    breadcrumbs {
      id
      label
      slug
    }
    signupBlock {
      ...SignupBlockFragment
    }
    seo {
      ...SEOContentFragment
    }
    path
  }
`;
