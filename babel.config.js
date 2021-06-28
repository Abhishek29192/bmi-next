"use strict";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    ["react-remove-properties", { properties: ["data-test", "data-testid"] }]
  ]
};
