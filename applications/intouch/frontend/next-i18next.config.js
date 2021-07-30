"use strict";

const { baseUrlDomain, isProd, isSingleMarket } = require("./lib/config");

// In local we should be able to run both multi market and single market
// localhost = single market
// domain = multimarket

const multiMarketDomains = [
  { domain: `en.${baseUrlDomain}`, defaultLocale: "en_EN" },
  { domain: `no.${baseUrlDomain}`, defaultLocale: "nb_NO" },

  // sub-domains not setup yet
  ...(isProd
    ? []
    : [
        { domain: `it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `es.${baseUrlDomain}`, defaultLocale: "es_ES" }
      ])
];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "it_IT", "es_ES", "nb_NO"],
    defaultLocale: "en_EN",
    domains: isSingleMarket
      ? [{ domain: "localhost", defaultLocale: "en_EN" }]
      : multiMarketDomains
  }
};
