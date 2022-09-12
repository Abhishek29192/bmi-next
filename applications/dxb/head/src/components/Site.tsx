import { graphql } from "gatsby";
import React from "react";
import { Region } from "./Header";
import { NavigationData } from "./Link";
import { fallbackGetMicroCopy, GetMicroCopy } from "./MicroCopy";
import { CalculatorConfig } from "./pitched-roof-calculator/types";
import { Data as ResourcesData } from "./Resources";
import { HouseType } from "./visualiser/Types";

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
  regions: Region[];
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
