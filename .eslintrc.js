"use strict";

module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
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
  plugins: ["react"],
  rules: {
    "prettier/prettier": "error",
    strict: "error",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "directive", next: "*" }
    ]
  },
  overrides: [
    {
      files: "jest/src/*.js",
      parserOptions: {
        sourceType: "module"
      }
    },
    {
      files: "*.{ts,tsx}",
      settings: {
        react: {
          version: "latest"
        }
      },
      excludedFiles: ["*.test.tsx"],
      rules: {
        "no-console": "error"
      }
    },
    {
      files: ["**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      env: {
        browser: true,
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
        document: true,
        window: true
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
