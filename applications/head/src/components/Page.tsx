import React from "react";
import BmiThemeProvider from "@bmi/theme-provider/src";
// import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import NewsletterSignUp from "../components/NewsLetterSignUp";
import { Helmet } from "react-helmet";
import { PageData, SiteData } from "../templates/types";

type Props = {
  children: React.ReactNode;
  pageData: PageData;
  siteData: SiteData;
};

const Page = ({ children, pageData, siteData }: Props) => {
  const { hero: heroData, slug } = pageData;
  const {
    footerMainNavigation,
    footerSecondaryNavigation,
    signUpTitle,
    signUpDescription,
    signUpInputLabel,
    signUpCallToAction
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
      {/* <Menu /> add this when merged */}
      <Hero data={heroData} level={slug === undefined ? 1 : 2} />
      {children}
      {pageData.showSignUpBanner ? (
        <NewsletterSignUp data={signUpData} />
      ) : null}
      <Footer
        mainNavigation={footerMainNavigation}
        secondaryNavigation={footerSecondaryNavigation}
      />
    </BmiThemeProvider>
  );
};

export default Page;
