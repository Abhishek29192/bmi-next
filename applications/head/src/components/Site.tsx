import { createContext } from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";
import { Data as NewsLetterSignUpData } from "./NewsLetterSignUp";

type Context = {
  countryCode: string;
  homePage: {
    title: string;
  };
  // NOTE: need to think how to manage microcopy resources. There needs to a
  // defined set. E.g ["page.linkLabel"]: string;
  resources: Record<string, string>;
};

type Resource = {
  key: string;
  value: string;
};

export const SiteContext = createContext<Context>({
  countryCode: "",
  homePage: {
    title: ""
  },
  resources: {}
});

export type Data = {
  homePage: {
    title: string;
  };
  countryCode: string;
  footerMainNavigation: NavigationData;
  footerSecondaryNavigation: NavigationData;
  menuNavigation: NavigationData;
  menuUtilities: NavigationData;
  resources: Resource[];
} & NewsLetterSignUpData;

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
    resources {
      key
      value
    }
  }
`;
