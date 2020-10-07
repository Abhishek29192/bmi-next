import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import BmiThemeProvider from "@bmi/theme-provider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsletterSignUp from "../components/NewsLetterSignUp";
import { SiteContext, Data as SiteData } from "./Site";

export type Data = {
  showSignUpBanner: boolean | null;
  slug?: string | null;
};

type Props = {
  children: React.ReactNode;
  title: string;
  pageData: Data;
  siteData: SiteData;
};

const parseResources = (resources: SiteData["resources"]): any => {
  return Object.assign(
    {},
    ...resources.map(({ key, value }) => ({ [key]: value }))
  );
};

const Page = ({ title, children, pageData, siteData }: Props) => {
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
    signUpTitle,
    signUpDescription,
    signUpInputLabel,
    signUpCallToAction
  };

  return (
    <BmiThemeProvider>
      <Helmet title={title} />
      <SiteContext.Provider
        value={{
          countryCode,
          homePage: siteData.homePage,
          resources: parseResources(siteData.resources)
        }}
      >
        <Header
          navigationData={menuNavigation}
          utilitiesData={menuUtilities}
          countryCode={countryCode}
        />
        {children}
        {pageData.showSignUpBanner ? (
          <NewsletterSignUp data={signUpData} />
        ) : null}
        <Footer
          mainNavigation={footerMainNavigation}
          secondaryNavigation={footerSecondaryNavigation}
        />
      </SiteContext.Provider>
    </BmiThemeProvider>
  );
};

export default Page;
