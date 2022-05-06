import React from "react";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import { BackToTop, MicroCopy } from "@bmi/components";
import { graphql, navigate } from "gatsby";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputBanner, {
  Data as InputBannerData
} from "../components/InputBanner";
import { getPathWithCountryCode } from "../utils/path";
import { BasketContextProvider } from "../contexts/SampleBasketContext";
import { useConfig } from "../contexts/ConfigProvider";
import BrandProvider from "./BrandProvider";
import {
  Context as SiteContext,
  Data as SiteData,
  SiteContextProvider,
  useSiteContext
} from "./Site";
import { Data as BreadcrumbsData } from "./Breadcrumbs";
import { generateGetMicroCopy } from "./MicroCopy";
import ErrorFallback from "./ErrorFallback";
import { Data as SEOContentData } from "./SEOContent";
import VisualiserProvider from "./Visualiser";
import Calculator from "./PitchedRoofCalcualtor";
import { Product, VariantOption } from "./types/pim";
import "../../src/styles/fonts.module.scss";
import { Head } from "./Head";
import IEDialog, { Data as IEDialogData } from "./IEDialog";

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
    scriptOnetrust,
    regions
  } = siteData;

  const { breadcrumbs, inputBanner, seo, path } = pageData;
  const {
    config: { gatsbyReCaptchaKey, gatsbyReCaptchaNet, visualizerAssetUrl }
  } = useConfig();
  const reCaptchaNet = gatsbyReCaptchaNet === "true";

  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);

  const dataIEDialog: IEDialogData = {
    ieDialogTitle: resources?.ieDialogTitle,
    ieDialogBody: resources?.ieDialogBody,
    ieDialogActionLabel: resources?.ieDialogActionLabel,
    ieDialogActionLink: resources?.ieDialogActionLink
  };

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
          headScripts,
          scriptOnetrust
        }}
        path={path}
        seo={seo}
        baseProduct={baseproduct}
        variantProduct={variantProduct}
        countryCode={countryCode}
      />
      <IEDialog data={dataIEDialog} />
      {/* TODO: move cascade of providers to separate composition component AppProviders */}
      <SiteContextProvider value={siteContext}>
        <MicroCopy.Provider values={microCopyContext}>
          <BasketContextProvider>
            <GoogleReCaptchaProvider
              reCaptchaKey={gatsbyReCaptchaKey}
              useRecaptchaNet={reCaptchaNet}
              language={countryCode}
            >
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
                    contentSource={visualizerAssetUrl}
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
              <Footer
                mainNavigation={footerMainNavigation}
                secondaryNavigation={footerSecondaryNavigation}
              />
              <BackToTop accessibilityLabel="Back to the top" />
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
