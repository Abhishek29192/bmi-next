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
    // Needed only until we can use upstream fixes or we take this into our
    // own setup properly
    "applications/dxb/libraries/gatsby-plugin-sitemap"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    complexity: "warn",
    "max-depth": "warn",
    "max-len": "warn",
    "max-lines": "warn",
    "max-lines-per-function": "warn",
    "max-nested-callbacks": "warn",
    "max-params": "warn",
    "max-statements": ["warn", { max: 25 }]
  },
  overrides: [
    {
      files: ["**/*.test.{ts,tsx}"],
      rules: {
        complexity: "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-params": "off",
        "max-statements": "off"
      }
    }
  ]
};
