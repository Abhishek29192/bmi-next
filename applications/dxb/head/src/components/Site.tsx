import { GoodBetterBest } from "@bmi/pim-types";
import { graphql } from "gatsby";
import React from "react";
import { GoodBetterBestIconsConfig } from "../types/GoodBetterBest";
import { fallbackGetMicroCopy, GetMicroCopy } from "./MicroCopy";
import type { AccountPage } from "../templates/myAccountPage/my-account";
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
  goodBetterBestIconsConfig: GoodBetterBestIconsConfig;
  accountPage?: {
    slug: string;
  };
};

const SiteContext = React.createContext<Context>({
  node_locale: "",
  countryCode: "",
  homePage: {
    title: ""
  },
  getMicroCopy: fallbackGetMicroCopy,
  goodBetterBestIconsConfig: {
    [GoodBetterBest.good]: "Thumb Up",
    [GoodBetterBest.better]: "Heart",
    [GoodBetterBest.best]: "Star"
  },
  accountPage: {
    slug: ""
  }
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
  regions: Region[] | null;
  pitchedRoofCalculatorConfig: CalculatorConfig | null;
  visualiserHouseTypes: HouseType[] | null;
  accountPage: AccountPage | null;
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
    regions {
      ...RegionFragment
    }
    pitchedRoofCalculatorConfig {
      ...PitchedRoofCalculatorFragment
    }
    visualiserHouseTypes {
      ...VisualiserHouseFragment
    }
    accountPage {
      slug
    }
  }
`;
