import BmiIcon from "@bmi-digital/components/logo/Bmi";
import React from "react";
import { renderToString } from "react-dom/server";
import { getPathWithCountryCode } from "../utils/path";
import { getLogo } from "../components/BrandLogo";

export const createSchemaOrgForHomeAndBrandPage = (
  siteUrl,
  pageType: string,
  countryCode: string,
  path: string,
  description?: string,
  brandLogo?: string,
  title?: string,
  sameAs?: string
): HomeAndBrandPageSchemaOrg => {
  const diffProp: Pick<HomeAndBrandPageSchemaOrg, "name" | "logo"> =
    pageType === "homePage"
      ? createSchemaOrgForHomePage(countryCode)
      : createSchemaOrgForBrandPage(brandLogo, title);
  const sameAsField =
    !!sameAs && sameAs.includes(",")
      ? sameAs
          .split(",")
          .filter(() => Boolean)
          .map((item) => item.trim())
      : (sameAs || "").trim();
  const pathWithCountryCode = getPathWithCountryCode(countryCode, path);
  return Object.assign(
    {},
    { "@type": "organization" },
    description && { description },
    countryCode && { inLanguage: countryCode },
    pathWithCountryCode && {
      url: `${siteUrl}${pathWithCountryCode}`
    },
    sameAs && { sameAs: sameAsField },
    { ...diffProp }
  );
};
type HomeAndBrandPageSchemaOrg = {
  "@type": "organization";
  description?: string | null;
  inLanguage?: string | null;
  url?: string | null;
  sameAs?: string | string[];
  name?: string | null;
  logo?: string | null;
};

export const createSchemaOrgForHomePage = (
  countryCode: string
): Pick<HomeAndBrandPageSchemaOrg, "name" | "logo"> => ({
  logo: renderToString(<BmiIcon />),
  name: `BMI Group ${countryCode}`
});

export const createSchemaOrgForBrandPage = (
  brand?: string,
  title?: string
): Pick<HomeAndBrandPageSchemaOrg, "name" | "logo"> => {
  const BrandLogo = getLogo(brand);
  return Object.assign(
    {},
    brand &&
      BrandLogo && {
        logo: renderToString(<BrandLogo />)
      },
    title && { name: title }
  );
};
