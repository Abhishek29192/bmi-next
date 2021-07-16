"use strict";

const isProd = process.env.NODE_ENV === "production";
const isMultiMarket = process.env.AUTH0_COOKIE_DOMAIN === "local.intouch";

// Prod will be always multimarket
const PROD_DOMAIN = [
  {
    domain: "intouch.dddev.io",
    defaultLocale: "en_EN"
  }
];

// In local we should be able to run both multi market and single market
// localhost = single market
// domain = multimarket
const LOCAL_DOMAIN = !isMultiMarket
  ? [{ domain: "localhost", defaultLocale: "en_EN" }]
  : [
      { domain: "en.local.intouch", defaultLocale: "en_EN" },
      { domain: "it.local.intouch", defaultLocale: "it_IT" },
      { domain: "es.local.intouch", defaultLocale: "es_ES" }
    ];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "it_IT", "es_ES"],
    defaultLocale: "en_EN",
    domains: isProd ? PROD_DOMAIN : LOCAL_DOMAIN
  }
};
