"use strict";

module.exports = {
  extends: "../../../.eslintrc.js",
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ["**/gatsby-ssr.js", "**/gatsby-browser.js"],
      parserOptions: {
        sourceType: "module"
      }
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    }
  ]
};
