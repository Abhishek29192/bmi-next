import { createContext } from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";

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
  signUpTitle: string;
  signUpDescription: {
    signUpDescription: string;
  };
  signUpInputLabel: string;
  signUpCallToAction: string;
  menuNavigation: NavigationData;
  menuUtilities: NavigationData;
};

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
