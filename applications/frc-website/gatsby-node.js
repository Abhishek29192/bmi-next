"use strict";

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const findUp = require("find-up");
const { withConfigs, styles } = require("@bmi/webpack");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig(
    withConfigs(
      {
        resolve: {
          plugins: [
            new TsconfigPathsPlugin({
              configFile: findUp.sync("tsconfig.json")
            })
          ]
        }
      },
      [styles({ dev: process.env.NODE_ENV === "development" })]
    )
  );
};
