import { createSchemaOrgForHomeAndBrandPage } from "../schemaOrgHomeAndBrandPage";

describe("createSchemaOrgForHomeAndBrandPage", () => {
  it("should return schema for home page with BMI logo and defaulted name", () => {
    const siteUrl = "https://bmigroup.com";
    const countryCode = "no";
    const locale = "nb-NO";
    const description = "Page description";
    const brandLogo = "AeroDek";
    const title = "Page title";
    const path = "/";
    const sameAs = "https://example.com";
    const { GATSBY_COUNTRY_NAME: countryName } = process.env;

    const schema = createSchemaOrgForHomeAndBrandPage(
      siteUrl,
      "homePage",
      locale,
      path,
      title,
      countryCode,
      description,
      brandLogo,
      sameAs
    );

    const expectedSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      description,
      knowsLanguage: locale,
      url: `${siteUrl}/${countryCode}/`,
      sameAs: [sameAs],
      name: `BMI Group ${countryName}`,
      logo: `${siteUrl}/brands/BMI.svg`
    };

    expect(schema).toEqual(expectedSchema);
  });

  it("should return schema for brand page with provided logo and title for name", () => {
    const siteUrl = "https://bmigroup.com";
    const countryCode = "no";
    const locale = "nb-NO";
    const description = "Page description";
    const brandLogo = "AeroDek";
    const title = "Page title";
    const path = "/brand";
    const sameAs = "https://example.com";

    const schema = createSchemaOrgForHomeAndBrandPage(
      siteUrl,
      "brandPage",
      locale,
      path,
      title,
      countryCode,
      description,
      brandLogo,
      sameAs
    );

    const expectedSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      description,
      knowsLanguage: locale,
      url: `${siteUrl}/${countryCode}/brand/`,
      sameAs: [sameAs],
      name: title,
      logo: `${siteUrl}/brands/${brandLogo}.svg`
    };

    expect(schema).toEqual(expectedSchema);
  });

  it("should return sameAs split by ','", () => {
    const siteUrl = "https://bmigroup.com";
    const countryCode = "no";
    const locale = "nb-NO";
    const description = "Page description";
    const brandLogo = "AeroDek";
    const title = "Page title";
    const path = "/brand";
    const sameAs = "https://example1.com,https://example2.com";

    const schema = createSchemaOrgForHomeAndBrandPage(
      siteUrl,
      "brandPage",
      locale,
      path,
      title,
      countryCode,
      description,
      brandLogo,
      sameAs
    );

    expect(schema["sameAs"]).toEqual([
      "https://example1.com",
      "https://example2.com"
    ]);
  });

  it("should remove starting and ending spaces from sameAs", () => {
    const siteUrl = "https://bmigroup.com";
    const countryCode = "no";
    const locale = "nb-NO";
    const description = "Page description";
    const brandLogo = "AeroDek";
    const title = "Page title";
    const path = "/brand";
    const sameAs = " https://example1.com  ,  https://example2.com ";

    const schema = createSchemaOrgForHomeAndBrandPage(
      siteUrl,
      "brandPage",
      locale,
      path,
      title,
      countryCode,
      description,
      brandLogo,
      sameAs
    );

    expect(schema["sameAs"]).toEqual([
      "https://example1.com",
      "https://example2.com"
    ]);
  });
});
