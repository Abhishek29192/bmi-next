"use strict";

const htmlTags = require("html-tags");
const webOnlyProps = ["className"];
const webOnlyImports = ["react-dom", "*.css", "*.scss"];

module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    process: false
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "script"
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": ["error", { trailingComma: "none" }],
    strict: "error",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "directive", next: "*" }
    ]
  },
  overrides: [
    {
      files: "*.{ts,tsx}",
      settings: {
        react: {
          version: "latest"
        }
      },
      excludedFiles: ["*.test.tsx"],
      rules: {
        "react/forbid-elements": [
          "error",
          {
            forbid: htmlTags.map((tag) => ({
              element: tag,
              message: "consider a .web.ts(x) file"
            }))
          }
        ],
        "react/forbid-dom-props": ["error", { forbid: webOnlyProps }],
        "react/forbid-component-props": ["error", { forbid: webOnlyProps }],
        "no-restricted-imports": [
          "error",
          {
            paths: [
              ...webOnlyImports.map((name) => ({
                name,
                message: "consider a .web.ts(x) file"
              }))
            ]
          }
        ],
        "no-console": "error"
      }
    },
    {
      files: ["*.web.{ts,tsx}"],
      env: {
        browser: true,
        node: false
      },
      rules: {
        "react/forbid-elements": "off",
        "react/forbid-dom-props": "off",
        "react/forbid-component-props": "off",
        "no-restricted-imports": ["error", { paths: [] }]
      }
    },
    {
      files: ["**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      env: {
        node: false,
        "shared-node-browser": true
      },
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
          jsx: true
        },
        sourceType: "module"
      },
      plugins: ["@typescript-eslint"],
      rules: {
        // Add TypeScript specific rules (and turn off ESLint equivalents)
        "@typescript-eslint/consistent-type-assertions": "warn",
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "warn",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
          "warn",
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false
          }
        ],
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true
          }
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "none",
            ignoreRestSiblings: true
          }
        ],
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "warn"
      }
    },
    {
      files: ["*.test.tsx"],
      globals: {
        document: true
      },
      env: {
        node: true,
        jest: true
      },
      plugins: ["jest"],
      rules: {
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/valid-describe": "error",
        "jest/valid-expect": "error"
      }
    },
    {
      files: ["**/test/**.{ts,tsx}"],
      globals: {
        document: true
      },
      env: {
        node: true,
        jest: true
      },
      plugins: ["jest"],
      rules: {
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/valid-describe": "error",
        "jest/valid-expect": "error"
      }
    }
  ]
};
