"use strict";

const isProd = process.env.NODE_ENV === "production";
const isMultiMarketLocally =
  process.env.AUTH0_COOKIE_DOMAIN === "local.intouch";

// Prod will be always multimarket
const PROD_DOMAIN = [
  { domain: "intouch.dddev.io", defaultLocale: "en_EN" },
  { domain: "en.intouch.dddev.io", defaultLocale: "en_EN" },
  { domain: "no.intouch.dddev.io", defaultLocale: "nb_NO" }
];

// In local we should be able to run both multi market and single market
// localhost = single market
// domain = multimarket
const LOCAL_DOMAIN = !isMultiMarketLocally
  ? [{ domain: "localhost", defaultLocale: "en_EN" }]
  : [
      { domain: "en.local.intouch", defaultLocale: "en_EN" },
      { domain: "it.local.intouch", defaultLocale: "it_IT" },
      { domain: "es.local.intouch", defaultLocale: "es_ES" },
      { domain: "no.local.intouch", defaultLocale: "nb_NO" }
    ];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "it_IT", "es_ES", "nb_NO"],
    defaultLocale: "en_EN",
    domains: isProd ? PROD_DOMAIN : LOCAL_DOMAIN
  }
};
