"use strict";

const webpack = require("webpack");
const MiniCssExtract = require("mini-css-extract-plugin");

const createStyleLoaders = (isModule, isSass = true, dev, isServer) =>
  [
    {
      loader: dev
        ? isServer
          ? "isomorphic-style-loader"
          : "style-loader"
        : MiniCssExtract.loader
    },
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        modules: isModule && {
          localIdentName: "[name]__[local]--[hash:base64:5]"
        }
      }
    },
    {
      loader: "postcss-loader",
      options: {
        config: { path: require.resolve("./postcss.config") }
      }
    },
    isSass && {
      loader: "sass-loader"
    }
  ].filter(Boolean);

const getExclude = (test) => {
  if (test === undefined) {
    return /node_modules/;
  }

  if (!test) {
    return;
  }

  return test;
};

const styleRules = ({ dev, isServer, exclude = {} } = {}) => {
  return {
    plugins: dev
      ? []
      : [
          new MiniCssExtract({
            filename: "static/chunks/[name].[contenthash:8].css",
            chunkFilename: "static/chunks/[name].[contenthash:8].chunk.css",
            ignoreOrder: true // Enable to remove warnings about conflicting order
          }),
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 10
          })
        ],
    rules: [
      {
        test: /\.css$/,
        exclude: getExclude(exclude.css),
        use: createStyleLoaders(false, false, dev, isServer)
      },
      {
        test: /\.module.scss$/,
        exclude: getExclude(exclude.scssModule),
        use: createStyleLoaders(true, true, dev, isServer)
      },
      {
        // eslint-disable-next-line security/detect-unsafe-regex
        test: /(?<!\.module)\.scss$/,
        exclude: getExclude(exclude.scss),
        use: createStyleLoaders(false, true, dev, isServer)
      }
    ]
  };
};

module.exports = styleRules;
