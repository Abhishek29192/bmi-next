import React from "react";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider/src";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsletterSignUp from "../components/NewsLetterSignUp";
import { SiteContext, Data as SiteData } from "./Site";

export type Data = {
  title: string;
  showSignUpBanner: boolean | null;
  slug?: string | null;
};

type Props = {
  children: React.ReactNode;
  pageData: Data;
  siteData: SiteData;
};

const Page = ({ children, pageData, siteData }: Props) => {
  const {
    countryCode,
    footerMainNavigation,
    footerSecondaryNavigation,
    signUpTitle,
    signUpDescription,
    signUpInputLabel,
    signUpCallToAction,
    menuNavigation,
    menuUtilities
  } = siteData;

  const signUpData = {
    title: signUpTitle,
    description: signUpDescription.signUpDescription,
    inputLabel: signUpInputLabel,
    inputCallToAction: signUpCallToAction
  };

  return (
    <BmiThemeProvider>
      <Helmet title={pageData.title} />
      <SiteContext.Provider
        value={{ countryCode, homePage: siteData.homePage }}
      >
        <Header navigationData={menuNavigation} utilitiesData={menuUtilities} />
        {children}
        {pageData.showSignUpBanner ? (
          <NewsletterSignUp data={signUpData} />
        ) : null}
        <Footer
          countryCode={countryCode}
          mainNavigation={footerMainNavigation}
          secondaryNavigation={footerSecondaryNavigation}
        />
      </SiteContext.Provider>
    </BmiThemeProvider>
  );
};

export default Page;
