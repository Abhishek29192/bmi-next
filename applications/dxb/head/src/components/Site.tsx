import { graphql } from "gatsby";
import React from "react";
import { fallbackGetMicroCopy, GetMicroCopy } from "./MicroCopy";
import type { Region } from "./Header";
import type { NavigationData } from "./Link";
import type { CalculatorConfig } from "./pitched-roof-calculator/types";
import type { Data as ResourcesData } from "./Resources";
import type { HouseType } from "./visualiser/Types";

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
    title: string | null;
  } | null;
  countryCode: string;
  footerMainNavigation: NavigationData | null;
  footerSecondaryNavigation: NavigationData | null;
  menuNavigation: NavigationData | null;
  menuUtilities: NavigationData | null;
  resources: ResourcesData | null;
  headScripts: {
    headScripts: string;
  } | null;
  regions: Region[] | null;
  pitchedRoofCalculatorConfig: CalculatorConfig | null;
  visualiserHouseTypes: HouseType[] | null;
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
    regions {
      ...RegionFragment
    }
    pitchedRoofCalculatorConfig {
      ...PitchedRoofCalculatorFragment
    }
    visualiserHouseTypes {
      ...VisualiserHouseFragment
    }
  }
`;
