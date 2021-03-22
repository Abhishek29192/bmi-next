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
  webpackFinal: async (config, { configType }) => {
    config.module.rules.find(
      (rule) => rule.test && rule.test.test(".svg")
    ).exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/,
      enforce: "pre",
      loader: require.resolve("@svgr/webpack")
    });

    config.module.rules.push(
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

    // prevents the Error: Module not found: Error: "Can't resolve fs"
    // solution taken from https://github.com/storybookjs/storybook/issues/4082#issuecomment-417329791
    config.resolve.alias.fs = path.resolve(__dirname, "mocks/fs.js");

    // fix error: node_modules/next-i18next/dist/commonjs/serverSideTranslations.js 90:62-72
    // Critical dependency: the request of a dependency is an expression
    config.resolve.alias["next-i18next/serverSideTranslations"] = path.resolve(
      __dirname,
      "mocks/serverSideTranslations.js"
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
