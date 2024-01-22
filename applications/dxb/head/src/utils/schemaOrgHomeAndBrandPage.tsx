import { isDefined } from "@bmi/utils";
import { getPathWithCountryCode } from "../utils/path";
import { OrganisationSchema } from "./schemaTypes";

export const createSchemaOrgForHomeAndBrandPage = (
  siteUrl: string,
  pageType: string,
  locale: string,
  path: string,
  title: string,
  countryCode?: string,
  description?: string,
  brandLogo?: string,
  sameAs?: string
): OrganisationSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: `${siteUrl}/brands/${
      pageType === "homePage" ? "BMI" : brandLogo
    }.svg`,
    name: pageType === "homePage" ? `BMI Group ${countryCode}` : title,
    description,
    knowsLanguage: locale,
    sameAs: sameAs
      ?.split(",")
      .filter(isDefined)
      .map((item) => item.trim()),
    url: `${siteUrl}${getPathWithCountryCode(countryCode, path)}`
  };
};
