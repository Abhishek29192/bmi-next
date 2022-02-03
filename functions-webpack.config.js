"use strict";

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "index.js",
    library: {
      type: "commonjs"
    }
  },
  target: "node",
  devtool:
    process.env.NODE_ENV === "production"
      ? "source-map"
      : "eval-cheap-module-source-map"
};
