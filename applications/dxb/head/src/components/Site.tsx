import { createContext } from "react";
import { graphql } from "gatsby";
import { NavigationData } from "./Link";
import { Data as ResourcesData } from "./Resources";
import { GetMicroCopy, fallbackGetMicroCopy } from "./MicroCopy";

type Context = {
  node_locale: string;
  countryCode: string;
  homePage: {
    title: string;
  };
  getMicroCopy: GetMicroCopy;
  reCaptchaKey?: string;
  reCaptchaNet?: boolean;
};

export const SiteContext = createContext<Context>({
  node_locale: "",
  countryCode: "",
  homePage: {
    title: ""
  },
  getMicroCopy: fallbackGetMicroCopy
});

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
  }
`;
