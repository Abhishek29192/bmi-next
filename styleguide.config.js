"use strict";

const path = require("path");
const fs = require("fs");
const { withConfigs, styles } = require("./libraries/webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const webpackConfig = withConfigs(
  {
    module: {
      rules: [
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
          use: ["@svgr/webpack"]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
              }
            }
          ]
        }
      ]
    },
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: "./tsconfig.json"
        })
      ]
    }
  },
  [styles({ dev: true })]
);

module.exports = {
  title: "BMI DXB Workbench",
  pagePerSection: true,
  ignore: ["**/__tests__/**", "**/node_modules/**"],
  exampleMode: "expand",
  defaultExample: true,
  skipComponentsWithoutExample: true,
  components: "./components/**/src/[A-Z]*.tsx",
  styleguideComponents: {
    Wrapper: path.join(__dirname, "components/theme-provider/src")
  },
  getComponentPathLine: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");
    const parts = componentPath.replace("components/", "").split("/");
    const importPath = `"@bmi/${parts[0].toLowerCase()}/${parts
      .slice(1)
      .join("/")}"`;

    // NOTE: this is displayed under the component name
    return `import ${componentName} from ${importPath};`;
  },
  getExampleFilename: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");
    const specificComponentExampleFile = path
      .join(componentPath, `../../${componentName}.md`)
      .replace();

    if (fs.existsSync(specificComponentExampleFile)) {
      return specificComponentExampleFile;
    }

    const exampleFile = path.join(componentPath, "../../README.md");

    if (fs.existsSync(exampleFile)) {
      return exampleFile;
    }

    return null;
  },
  propsParser: require("react-docgen-typescript").withCustomConfig(
    "./tsconfig.json"
  ).parse,
  webpackConfig
};
