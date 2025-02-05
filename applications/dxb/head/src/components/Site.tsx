import React from "react";
import { fallbackGetMicroCopy, GetMicroCopy } from "./MicroCopy";
import type { AccountPage } from "../templates/myAccountPage/types";
import type { Region } from "./Header";
import type { NavigationData } from "./link/types";
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
  accountPage: {
    slug: string;
  } | null;
};

const SiteContext = React.createContext<Context>({
  node_locale: "",
  countryCode: "",
  homePage: {
    title: ""
  },
  getMicroCopy: fallbackGetMicroCopy,
  accountPage: {
    slug: ""
  }
});

export const SiteContextProvider = SiteContext.Provider;

export const useSiteContext = () => React.useContext(SiteContext);

export type Data = {
  homePage: {
    title: string;
    sys: { id: string };
  };
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
  sys: {
    locale: string;
  };
};
