"use strict";

module.exports = {
  ci: {
    collect: {
      // NOTE: URL(s) to search.
      // Can be overidden in command line with: --collect.url=
      url: ["http://localhost:8000/no"],
      // NOTE: Number of runs per page (with result aggregated)
      // Can be overidden in command line with: --collect.numberOfRuns=
      numberOfRuns: 3,
      puppeteerScript: "./scripts/login-head-netlify.js",
      puppeteerLaunchOptions: {
        args: ["--no-sandbox"]
      },
      settings: {
        // NOTE: set password for puppeteerScript.
        // Defaulted to "pwd" (ignored) , set to correct value in
        // command line with --collect.settings.pwd=
        pwd: "pwd",
        chromeFlags: "--no-sandbox"
      }
    },
    assert: {
      assertions: {
        // NOTE: Set additional categories with alerting here.
        "categories:accessibility": ["warn", { minScore: 0.75 }]
      }
    }
    // TODO: Future work to configure upload section to upload to Lighthouse
    // server for performance analysis and build history.
    // upload: {
    // }
  }
};
