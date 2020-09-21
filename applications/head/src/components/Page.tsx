import React from "react";
import { graphql } from "gatsby";
import BmiThemeProvider from "@bmi/theme-provider/src";
import Header from "../components/Header";
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
  const { hero, heroes, slug } = pageData;
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
      <Header navigationData={menuNavigation} utilitiesData={menuUtilities} />
      <Hero
        data={[].concat(hero, heroes).filter(Boolean)}
        hasSpaceBottom={!slug}
      />
      {children}
      {pageData.showSignUpBanner ? (
        <NewsletterSignUp data={signUpData} />
      ) : null}
      <Footer
        countryCode={countryCode}
        mainNavigation={footerMainNavigation}
        secondaryNavigation={footerSecondaryNavigation}
      />
    </BmiThemeProvider>
  );
};

export default Page;

export const query = graphql`
  fragment LinkFragment on ContentfulLink {
    id
    label
    icon
    isLabelHidden
    url
    linkedPage {
      ... on ContentfulSimplePage {
        slug
      }
      ... on ContentfulContactUsPage {
        slug
      }
    }
  }
`;
