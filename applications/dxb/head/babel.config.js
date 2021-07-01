"use strict";

module.exports = {
  extends: "../../../babel.config.js",
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
  presets: [
    [
      "babel-preset-gatsby",
      {
        targets: {
          browsers: [">0.25%", "not dead"]
        }
      }
    ]
  ]
};