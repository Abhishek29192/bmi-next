"use strict";

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const createStyleLoaders = (isModule, isSass = true) =>
  [
    {
      loader: "style-loader"
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
        postcssOptions: {
          config: require.resolve("./postcss.config")
        }
      }
    },
    isSass && {
      loader: "sass-loader"
    }
  ].filter(Boolean);

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                    targets: {
                      node: "current"
                    }
                  }
                ],
                "@babel/preset-react"
              ],
              env: {
                production: {
                  presets: ["minify"]
                },
                test: {
                  presets: ["@babel/preset-env", "@babel/preset-react"]
                }
              }
            }
          }
        ], // , 'source-map-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: [/node_modules/],
        use: ["@svgr/webpack"]
      },
      {
        // eslint-disable-next-line security/detect-unsafe-regex
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: createStyleLoaders(false, false)
      },
      {
        test: /\.module.scss$/,
        exclude: /node_modules/,
        use: createStyleLoaders(true, true)
      },
      {
        // eslint-disable-next-line security/detect-unsafe-regex
        test: /(?<!\.module)\.scss$/,
        exclude: /node_modules/,
        use: createStyleLoaders(false, true)
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      })
    ]
  }
};
