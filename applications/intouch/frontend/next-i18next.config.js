"use strict";

const { baseUrlDomain } = require("./lib/config");

// In local we should be able to run both multi market and single market
// localhost = single market
// domain = multimarket

const multiMarketDomains =
  process.env.APP_ENV === "dev"
    ? [
        { domain: `dev-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `dev-no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ]
    : process.env.APP_ENV === "uat"
    ? [
        { domain: `uat-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `uat-no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ]
    : [
        { domain: `en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `no.${baseUrlDomain}`, defaultLocale: "nb_NO" }
      ];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "it_IT", "es_ES", "nb_NO"],
    defaultLocale: "en_EN",
    domains: multiMarketDomains
  }
};
