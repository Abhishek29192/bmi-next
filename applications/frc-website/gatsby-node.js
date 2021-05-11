"use strict";

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const findUp = require("find-up");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: findUp.sync("tsconfig.json")
        })
      ]
    }
  });
};
