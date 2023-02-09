"use strict";

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      puppeteerScript: "./scripts/login-head-netlify.js",
      puppeteerLaunchOptions: {
        args: ["--no-sandbox"]
      },
      settings: {
        extraHeaders: JSON.stringify({
          Authorization: process.env.LIGHTHOUSE_AUTHORIZATION
        }),
        pwd: ""
      }
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.75 }], // Third party scripts log errors to console, which drops our score
        "categories:performance": ["warn", { minScore: 0.07 }],
        "categories:seo": ["error", { minScore: 0.69 }] // Unless we enforce meta descriptions, this can't be increased
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "lighthouseci/reports"
    }
  }
};
