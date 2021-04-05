const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { withConfigs, styles } = require("@bmi/webpack");

module.exports = {
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  // https://storybook.js.org/docs/react/configure/typescript
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  },
  babel: async (options) => ({ ...options, babelrc: false, configFile: false }),
  webpackFinal: async (config) => {
    const resolveMockModule = (moduleName) => {
      config.resolve.alias[moduleName] = path.resolve(
        __dirname,
        `mocks/${moduleName}.js`
      );
    };
    resolveMockModule("fs");
    resolveMockModule("@auth0/nextjs-auth0");
    resolveMockModule("next-i18next/serverSideTranslations");

    config.module.rules.find(
      (rule) => rule.test && rule.test.test(".svg")
    ).exclude = /\.svg$/;

    config.module.rules.push(
      {
        test: /\.svg$/,
        enforce: "pre",
        loader: require.resolve("@svgr/webpack")
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
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loaders: ["file-loader"],
        include: path.resolve(__dirname, "../")
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
      }
    );

    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      })
    );

    const bmiWebpackConfig = styles({ dev: true, exclude: { css: null } });

    const configWithStyleRules = withConfigs(config, [
      {
        ...bmiWebpackConfig,
        rules: [
          // storybook needs to import global CSS from globals.css
          {
            test: /\.module\.css$/,
            include: path.resolve(__dirname, "../"),
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true
                }
              }
            ]
          },
          // exclude the css-loader rules in @bmi/webpack for storybook
          ...bmiWebpackConfig.rules.slice(1)
        ]
      }
    ]);

    return configWithStyleRules;
  }
};
