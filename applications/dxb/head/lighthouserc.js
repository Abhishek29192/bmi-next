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
        pwd: "",
        chromeFlags: "--no-sandbox"
      }
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        // "categories:accessibility": ["error", { minScore: 0.9 }]
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "lighthouseci/reports"
    }
  }
};
