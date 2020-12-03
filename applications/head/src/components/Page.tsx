import React from "react";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider";
import BackToTop from "@bmi/back-to-top";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputBanner, {
  Data as InputBannerData
} from "../components/InputBanner";
import { SiteContext, Data as SiteData } from "./Site";
import { generateGetMicroCopy } from "./MicroCopy";
import { graphql } from "gatsby";

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
        {children}
        {inputBanner ? <InputBanner data={inputBanner} /> : null}
        <Footer
          mainNavigation={footerMainNavigation}
          secondaryNavigation={footerSecondaryNavigation}
        />
      </SiteContext.Provider>
      <BackToTop accessibilityLabel="Back to the top" />
    </BmiThemeProvider>
  );
};

export default Page;

export const query = graphql`
  fragment PageFragment on ContentfulPage {
    slug
    inputBanner {
      ...InputBannerFragment
    }
  }
`;
