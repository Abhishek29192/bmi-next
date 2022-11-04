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
        { domain: `dev-my.${baseUrlDomain}`, defaultLocale: "en_MY" },
        { domain: `dev-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" },
        { domain: `dev-uk.${baseUrlDomain}`, defaultLocale: "en_UK" },
        { domain: `dev-se.${baseUrlDomain}`, defaultLocale: "sv_SE" },
        { domain: `dev-pl.${baseUrlDomain}`, defaultLocale: "pl_PL" }
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
        { domain: `uat-my.${baseUrlDomain}`, defaultLocale: "en_MY" },
        { domain: `uat-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" },
        { domain: `uat-uk.${baseUrlDomain}`, defaultLocale: "en_UK" },
        { domain: `uat-se.${baseUrlDomain}`, defaultLocale: "sv_SE" },
        { domain: `uat-pl.${baseUrlDomain}`, defaultLocale: "pl_PL" }
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
        { domain: `preprod-my.${baseUrlDomain}`, defaultLocale: "en_MY" },
        { domain: `preprod-fi.${baseUrlDomain}`, defaultLocale: "fi_FI" },
        { domain: `preprod-uk.${baseUrlDomain}`, defaultLocale: "en_UK" },
        { domain: `preprod-se.${baseUrlDomain}`, defaultLocale: "sv_SE" },
        { domain: `preprod-pl.${baseUrlDomain}`, defaultLocale: "pl_PL" }
      ]
    : [
        { domain: `it.${baseUrlDomain}`, defaultLocale: "it_IT" },
        { domain: `en.${baseUrlDomain}`, defaultLocale: "en_EN" },
        { domain: `no.${baseUrlDomain}`, defaultLocale: "nb_NO" },
        { domain: `dk.${baseUrlDomain}`, defaultLocale: "da_DK" },
        { domain: `de.${baseUrlDomain}`, defaultLocale: "de_DE" },
        { domain: `es.${baseUrlDomain}`, defaultLocale: "es_ES" },
        { domain: `pt.${baseUrlDomain}`, defaultLocale: "pt_PT" },
        { domain: `my.${baseUrlDomain}`, defaultLocale: "en_MY" },
        { domain: `fi.${baseUrlDomain}`, defaultLocale: "fi_FI" },
        { domain: `uk.${baseUrlDomain}`, defaultLocale: "en_UK" },
        { domain: `se.${baseUrlDomain}`, defaultLocale: "sv_SE" },
        { domain: `pl.${baseUrlDomain}`, defaultLocale: "pl_PL" }
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
      "en_MY",
      "fi_FI",
      "en_UK",
      "sv_SE",
      "pl_PL"
    ],
    defaultLocale: "en_EN",
    domains: multiMarketDomains
  }
};
