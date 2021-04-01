"use strict";

const PROD_DOMAIN = [
  {
    domain: "frontend-rfwslk3zjq-nw.a.run.app",
    defaultLocale: "en"
  }
];
const LOCAL_DOMAIN = [
  {
    domain: "intouch.local",
    defaultLocale: "en"
  }
];

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en", "de"],
    defaultLocale: "en",
    domains: isProd ? PROD_DOMAIN : LOCAL_DOMAIN
  }
};
