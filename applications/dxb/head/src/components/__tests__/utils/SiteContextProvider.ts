import { GoodBetterBest } from "@bmi/pim-types";
import { Context as SiteContextType } from "../../Site";

export const getMockSiteContext = (
  countryCode = "en",
  nodeLocale = "en-GB"
): SiteContextType => ({
  countryCode: countryCode,
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: nodeLocale,
  homePage: {
    title: "Home page title"
  },
  goodBetterBestIconsConfig: {
    [GoodBetterBest.good]: "Thumb Up",
    [GoodBetterBest.better]: "Heart",
    [GoodBetterBest.best]: "Star"
  }
});
