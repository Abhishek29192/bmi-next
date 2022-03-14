"use strict";

module.exports = {
  extends: "../../.eslintrc.js",
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ["**/gatsby-ssr.js", "**/gatsby-browser.js"],
      parserOptions: {
        sourceType: "module"
      }
    }
  ]
};
