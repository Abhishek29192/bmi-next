"use strict";

const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

const createStyleLoaders = (isModule, isSass = true, dev, isServer) =>
  [
    {
      loader: dev
        ? isServer
          ? "isomorphic-style-loader"
          : "style-loader"
        : ExtractCssChunks.loader
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

const styleRules = ({ dev, isServer } = {}) => ({
  plugins: dev
    ? []
    : [
        new ExtractCssChunks({
          filename: "static/chunks/[name].[contenthash:8].css",
          chunkFilename: "static/chunks/[name].[contenthash:8].chunk.css"
        })
      ],
  rules: [
    {
      test: /\.css$/,
      use: createStyleLoaders(false, false, dev, isServer)
    },
    {
      test: /\.module.scss$/,
      use: createStyleLoaders(true, true, dev, isServer)
    },
    {
      test: /(?<!\.module)\.scss$/,
      use: createStyleLoaders(false, true, dev, isServer)
    }
  ]
});

module.exports = styleRules;
