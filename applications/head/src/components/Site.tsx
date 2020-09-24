import { createContext } from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";
import { Data as NewsLetterSignUpData } from "./NewsLetterSignUp";

type Context = {
  countryCode: string;
};

export const SiteContext = createContext<Context>({
  countryCode: ""
});

export type Data = {
  countryCode: string;
  footerMainNavigation: NavigationData;
  footerSecondaryNavigation: NavigationData;
  menuNavigation: NavigationData;
  menuUtilities: NavigationData;
} & NewsLetterSignUpData;

export const query = graphql`
  fragment SiteFragment on ContentfulSite {
    countryCode
    menuNavigation {
      ...HeaderNavigationFragment
    }
    menuUtilities {
      ...HeaderUtilitiesFragment
    }
    footerMainNavigation {
      ...FooterMainNavigationFragment
    }
    footerSecondaryNavigation {
      ...FooterSecondaryNavigationFragment
    }
    ...SignUpFragment
  }
`;
