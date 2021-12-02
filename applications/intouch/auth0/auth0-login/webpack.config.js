/* eslint-disable */

"use strict";

const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const environment = require("./configuration/environment");

const templateFiles = fs
  .readdirSync(environment.paths.source)
  .filter((file) => path.extname(file).toLowerCase() === ".html");

const htmlPluginEntries = templateFiles.map(
  (template) =>
    new HTMLWebpackPlugin({
      inject: true,
      hash: false,
      filename: template,
      template: path.resolve(environment.paths.source, template)
    })
);

module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, "js", "app.js")
  },
  output: {
    filename: "js/[name].js",
    path: environment.paths.output
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "fonts/[name].[hash:6].[ext]",
              publicPath: "../",
              limit: environment.limits.fonts
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ["**/*", "!stats.json"]
    })
  ].concat(htmlPluginEntries),
  target: "web"
};
