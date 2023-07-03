import { renderToString } from "react-dom/server";
import React from "react";
import { BMI as BmiIcon } from "@bmi-digital/components/logo";
import {
  createSchemaOrgForBrandPage,
  createSchemaOrgForHomeAndBrandPage,
  createSchemaOrgForHomePage
} from "../schemaOrgHomeAndBrandPage";

describe("createSchemaOrgForHomeAndBrandPage", () => {
  it("should return schema for home page", () => {
    const countryCode = "US";
    const description = "Homepage description";
    const brandLogo = "brand-logo-url";
    const title = "Homepage title";
    const path = "/";
    const sameAs = "https://example.com";

    const expectedSchema = {
      "@type": "organization",
      description,
      inLanguage: countryCode,
      url: `/${countryCode}/`,
      sameAs: sameAs,
      name: `BMI Group ${countryCode}`,
      logo: renderToString(<BmiIcon />)
    };

    const schema = createSchemaOrgForHomeAndBrandPage(
      "homePage",
      countryCode,
      path,
      description,
      brandLogo,
      title,
      sameAs
    );

    expect(schema).toEqual(expectedSchema);
  });

  it("should return schema for brand page", () => {
    const countryCode = "US";
    const description = "Brand page description";
    const brandLogo = "brand-logo-url";
    const title = "Brand page title";
    const path = "/brand";
    const sameAs = "https://example.com,https://example2.com";

    const expectedSchema = {
      "@type": "organization",
      description,
      inLanguage: countryCode,
      url: `/${countryCode}/brand/`,
      sameAs: ["https://example.com", "https://example2.com"],
      name: title,
      logo: brandLogo
    };

    const schema = createSchemaOrgForHomeAndBrandPage(
      "brandPage",
      countryCode,
      path,
      description,
      brandLogo,
      title,
      sameAs
    );

    expect(schema).toEqual(expectedSchema);
  });
});

describe("createSchemaOrgForHomePage", () => {
  it("should return different props schema for home page", () => {
    const countryCode = "US";

    const expectedSchema = {
      logo: renderToString(<BmiIcon />),
      name: `BMI Group ${countryCode}`
    };

    const schema = createSchemaOrgForHomePage(countryCode);

    expect(schema).toEqual(expectedSchema);
  });

  it("should return different props schema for brand page", () => {
    const brandLogo = "Zanda";

    const expectedSchema = {
      logo: "Zanda"
    };

    const schema = createSchemaOrgForBrandPage(brandLogo);

    expect(schema).toEqual(expectedSchema);
  });
});
