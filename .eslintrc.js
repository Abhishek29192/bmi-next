"use strict";

module.exports = {
  extends: ["@bmi-digital/eslint-config/react"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "coverage/**",
    "coverage-ts/**",
    "**/public/**",
    ".yarn/**",
    ".yarn_cache",
    // Needed only until we can use upstream fixes or we take this into our own setup properly
    "applications/dxb/libraries/gatsby-plugin-sitemap"
  ],
  rules: {
    "import/extensions": [0, "never"]
  }
};
