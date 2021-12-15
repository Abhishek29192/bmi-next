"use strict";

const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { withConfigs, styles } = require("./libraries/webpack");

const babel = {
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
        // TODO: This complains for already minified libraries (e.g. ThreeJs).
        // Ideally we should have a specific rule just for that file.
        // presets: ["minify"]
      },
      test: {
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }
    }
  }
};

const webpackConfig = withConfigs(
  {
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          use: [babel], // , 'source-map-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.svg$/,
          use: "file-loader",
          include: path.resolve(__dirname, "libraries/visualiser-library")
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
          exclude: [
            /node_modules/,
            path.resolve(__dirname, "libraries/visualiser-library")
          ],
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
  [styles({ dev: true, exclude: { css: null } })]
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
    const packageName = componentPath.replace("components/", "").split("/")[0];
    const importPath = `"@bmi/${packageName}"`;

    // NOTE: this is displayed under the component name
    return `import ${componentName} from ${importPath};`;
  },
  getExampleFilename: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");
    const specificComponentExampleFile = path
      .join(componentPath, `../../${componentName}.md`)
      .replace();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(specificComponentExampleFile)) {
      return specificComponentExampleFile;
    }

    const exampleFile = path.join(componentPath, "../../README.md");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
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
