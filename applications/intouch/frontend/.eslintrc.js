"use strict";

module.exports = {
  overrides: [
    {
      files: "./graphql/generated/**",
      rules: {
        "import/newline-after-import": "warn",
        "import/order": "warn"
      }
    }
  ]
};
