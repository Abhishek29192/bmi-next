import BackToTop from "@bmi-digital/components/back-to-top";
import MicroCopy from "@bmi-digital/components/micro-copy";
import { graphql } from "gatsby";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useConfig } from "../contexts/ConfigProvider";
import { BasketContextProvider } from "../contexts/SampleBasketContext";
import { getPathWithCountryCode } from "../utils/path";
import BrandProvider from "./BrandProvider";
import ErrorFallback from "./ErrorFallback";
import FallbackComponent from "./FallbackComponent";
import { Head } from "./Head";
import { generateGetMicroCopy } from "./MicroCopy";
import SignupBlock from "./SignupBlock";
import { SiteContextProvider, useSiteContext } from "./Site";
import VisualiserProvider from "./Visualiser";
import CalculatorProvider from "./PitchedRoofCalculator";
import type { Context as SiteContext, Data as SiteData } from "./Site";
import type { Data as SignupBlockData } from "./SignupBlock";
import type { Product } from "../types/pim";
import type { Data as SEOContentData } from "./SEOContent";
import type { Data as BreadcrumbsData } from "./Breadcrumbs";

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
  brand?: string | null;
  children: Children;
  title: string;
  pageData: Data;
  siteData: SiteData;
  disableSearch?: boolean;
  variantCodeToPathMap?: Record<string, string>;
  ogImageUrl?: string;
  variantProduct?: Product;
  pageType?: string;
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
  variantProduct,
  pageType
}: Props) => {
  const {
    node_locale,
    countryCode,
    footerMainNavigation,
    footerSecondaryNavigation,
    menuNavigation,
    menuUtilities,
    resources,
    regions,
    pitchedRoofCalculatorConfig,
    visualiserHouseTypes,
    accountPage
  } = siteData;
  const { breadcrumbs, signupBlock, seo, path } = pageData;
  const { gatsbyReCaptchaKey, gatsbyReCaptchaNet, visualizerAssetUrl } =
    useConfig();
  const router = useRouter();
  const reCaptchaNet = gatsbyReCaptchaNet === "true";

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  const microCopyContext = resources?.microCopy?.reduce(
    (carry, { key, value }) => ({
      ...carry,
      [key]: value
    }),
    {}
  );

  const siteContext = useMemo(
    () => ({
      node_locale,
      countryCode,
      homePage: siteData.homePage,
      getMicroCopy,
      gatsbyReCaptchaKey,
      reCaptchaNet,
      accountPage
    }),
    [
      accountPage,
      countryCode,
      gatsbyReCaptchaKey,
      getMicroCopy,
      node_locale,
      reCaptchaNet,
      siteData.homePage
    ]
  );

  const seoTitle =
    variantProduct && variantProduct.seoTitle ? variantProduct.seoTitle : title;

  const onError = useCallback(
    () => navigate(getPathWithCountryCode(countryCode, "422")),
    [countryCode]
  );

  const fallbackRender = useCallback(
    () => (
      <ErrorFallback
        countryCode={countryCode}
        promo={resources?.errorGeneral}
      />
    ),
    [countryCode, resources?.errorGeneral]
  );

  return (
    <div style={{ overflowX: "hidden", display: "contents" }}>
      <Head
        htmlAttributes={{ lang: node_locale }}
        title={seoTitle}
        defer={false}
        ogImageUrl={ogImageUrl}
        path={path}
        seo={seo}
        variantProduct={variantProduct}
        countryCode={countryCode}
        pageType={pageType}
        brandLogo={brand}
      />
      <SiteContextProvider value={siteContext}>
        <MicroCopy.Provider values={microCopyContext}>
          <GoogleReCaptchaProvider
            reCaptchaKey={gatsbyReCaptchaKey}
            useRecaptchaNet={reCaptchaNet}
            language={countryCode}
          >
            <ErrorBoundary fallbackRender={fallbackRender} onError={onError}>
              <BasketContextProvider>
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
                  sampleBasketLink={resources?.sampleBasketLink ?? undefined}
                  maximumSamples={resources?.maximumSamples ?? null}
                />
                <VisualiserProvider
                  contentSource={visualizerAssetUrl}
                  variantCodeToPathMap={variantCodeToPathMap}
                  shareWidgetData={
                    resources?.visualiserShareWidget ?? undefined
                  }
                  houseTypes={visualiserHouseTypes}
                >
                  <CalculatorProvider
                    onError={() =>
                      router.push(getPathWithCountryCode(countryCode, "422"))
                    }
                    calculatorConfig={pitchedRoofCalculatorConfig}
                  >
                    <BrandProvider brand={brand}>
                      <Content>{children}</Content>
                    </BrandProvider>
                  </CalculatorProvider>
                </VisualiserProvider>
              </BasketContextProvider>
              {signupBlock ? <SignupBlock data={signupBlock} /> : null}
              <Footer
                mainNavigation={footerMainNavigation}
                secondaryNavigation={footerSecondaryNavigation}
              />
              <BackToTop accessibilityLabel="Back to the top" />
            </ErrorBoundary>
          </GoogleReCaptchaProvider>
        </MicroCopy.Provider>
      </SiteContextProvider>
    </div>
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
