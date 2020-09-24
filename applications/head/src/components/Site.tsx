import { createContext } from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";

type Context = {
  countryCode: string;
  homePage: {
    title: string;
  };
};

export const SiteContext = createContext<Context>({
  countryCode: "",
  homePage: {
    title: ""
  }
});

export type Data = {
  homePage: {
    title: string;
  };
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
    homePage {
      title
    }
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
