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
        { domain: `dev-no.${baseUrlDomain}`, defaultLocale: "nb_NO" },
        { domain: `dev-dk.${baseUrlDomain}`, defaultLocale: "da_DK" },
        { domain: `dev-de.${baseUrlDomain}`, defaultLocale: "de_DE" },
        { domain: `dev-es.${baseUrlDomain}`, defaultLocale: "es_ES" },
        { domain: `dev-pt.${baseUrlDomain}`, defaultLocale: "pt_PT" },
        { domain: `dev-my.${baseUrlDomain}`, defaultLocale: "ms_MY" },
        { domain: `dev-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" }
      ]
    : process.env.APP_ENV === "uat"
    ? [
        { domain: `uat-it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `uat-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `uat-no.${baseUrlDomain}`, defaultLocale: "nb_NO" },
        { domain: `uat-dk.${baseUrlDomain}`, defaultLocale: "da_DK" },
        { domain: `uat-de.${baseUrlDomain}`, defaultLocale: "de_DE" },
        { domain: `uat-es.${baseUrlDomain}`, defaultLocale: "es_ES" },
        { domain: `uat-pt.${baseUrlDomain}`, defaultLocale: "pt_PT" },
        { domain: `uat-my.${baseUrlDomain}`, defaultLocale: "ms_MY" },
        { domain: `uat-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" }
      ]
    : process.env.APP_ENV === "preprod"
    ? [
        { domain: `preprod-it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `preprod-en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `preprod-no.${baseUrlDomain}`, defaultLocale: "nb_NO" },
        { domain: `preprod-dk.${baseUrlDomain}`, defaultLocale: "da_DK" },
        { domain: `preprod-de.${baseUrlDomain}`, defaultLocale: "de_DE" },
        { domain: `preprod-es.${baseUrlDomain}`, defaultLocale: "es_ES" },
        { domain: `preprod-pt.${baseUrlDomain}`, defaultLocale: "pt_PT" },
        { domain: `preprod-my.${baseUrlDomain}`, defaultLocale: "ms_MY" },
        { domain: `preprod-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" }
      ]
    : [
        { domain: `it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `no.${baseUrlDomain}`, defaultLocale: "nb_NO" },
        { domain: `dk.${baseUrlDomain}`, defaultLocale: "da_DK" },
        { domain: `de.${baseUrlDomain}`, defaultLocale: "de_DE" },
        { domain: `es.${baseUrlDomain}`, defaultLocale: "es_ES" },
        { domain: `pt.${baseUrlDomain}`, defaultLocale: "pt_PT" },
        { domain: `my.${baseUrlDomain}`, defaultLocale: "ms_MY" },
        { domain: `fi.${baseUrlDomain}`, defaultLocale: "fi_FI" }
      ];

module.exports = {
  i18n: {
    localeDetection: false,
    locales: [
      "en_EN",
      "nb_NO",
      "it_IT",
      "da_DK",
      "de_DE",
      "es_ES",
      "pt_PT",
      "ms_MY",
      "fi_FI"
    ],
    defaultLocale: "en_EN",
    domains: multiMarketDomains
  }
};
