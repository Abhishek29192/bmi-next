"use strict";

const { baseUrlDomain } = require("./lib/config");

// In local we should be able to run both multi market and single market
// localhost = single market
// domain = multimarket

const multiMarketDomains =
  process.env.APP_ENV === "dev"
    ? [
        { domain: `dev-it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `dev-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `dev-no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ]
    : process.env.APP_ENV === "uat"
    ? [
        { domain: `uat-it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `uat-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `uat-no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ]
    : process.env.APP_ENV === "preprod"
    ? [
        { domain: `preprod-it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `preprod-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `preprod-no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ]
    : [
        { domain: `it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "nb_NO", "it_IT"],
    defaultLocale: "en_EN",
    domains: multiMarketDomains
  }
};
