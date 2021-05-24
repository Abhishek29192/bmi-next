"use strict";

const PROD_DOMAIN = [
  {
    domain: "frontend-rfwslk3zjq-nw.a.run.app",
    defaultLocale: "en_EN"
  }
];
const LOCAL_DOMAIN = [
  { domain: "localhost", defaultLocale: "en_EN" },
  { domain: "en.local.intouch", defaultLocale: "en_EN" },
  { domain: "it.local.intouch", defaultLocale: "it_IT" },
  { domain: "de.local.intouch", defaultLocale: "de_DE" },
  { domain: "us.local.intouch", defaultLocale: "en_US" }
];

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en_EN", "it_IT", "de_DE", "en_US"],
    defaultLocale: "en_EN",
    domains: isProd ? PROD_DOMAIN : LOCAL_DOMAIN
  }
};
