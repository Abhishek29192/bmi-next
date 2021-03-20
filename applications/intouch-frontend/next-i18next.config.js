"use strict";

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ["en", "de"],
    defaultLocale: "en",
    domains: [
      {
        domain: "localhost",
        defaultLocale: "en"
      },
      {
        domain: "bmitest.local",
        defaultLocale: "de"
      }
    ]
  }
};
