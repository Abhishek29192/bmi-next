import React from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";
import { Data as ResourcesData } from "./Resources";
import { GetMicroCopy, fallbackGetMicroCopy } from "./MicroCopy";
import { Region } from "./Header";

export type Context = {
  node_locale: string;
  countryCode: string;
  homePage: {
    title: string;
  };
  getMicroCopy: GetMicroCopy;
  reCaptchaKey?: string;
  reCaptchaNet?: boolean;
};

const SiteContext = React.createContext<Context>({
  node_locale: "",
  countryCode: "",
  homePage: {
    title: ""
  },
  getMicroCopy: fallbackGetMicroCopy
});

export const SiteContextProvider = SiteContext.Provider;

export const useSiteContext = () => React.useContext(SiteContext);

export type Data = {
  node_locale: string;
  homePage: {
    title: string;
  };
  countryCode: string;
  footerMainNavigation: NavigationData;
  footerSecondaryNavigation: NavigationData;
  menuNavigation: NavigationData;
  menuUtilities: NavigationData;
  resources: ResourcesData;
  headScripts?: {
    headScripts: string;
  } | null;
  scriptGA?: string | null;
  scriptOnetrust?: string | null;
  scriptHotJar?: string | null;
  scriptGOptLoad?: string | null;
  regions: Region[];
};

export const query = graphql`
  fragment SiteFragment on ContentfulSite {
    node_locale
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
    resources {
      ...ResourcesFragment
    }
    headScripts {
      headScripts
    }
    scriptGA
    scriptOnetrust
    scriptHotJar
    scriptGOptLoad
    regions {
      ...RegionFragment
    }
  }
`;
