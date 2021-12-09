"use strict";

module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:security/recommended"
  ],
  globals: {
    __dirname: "readonly",
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
  plugins: ["react", "security", "import"],
  rules: {
    "no-unused-vars": "error",
    "prettier/prettier": "error",
    strict: "error",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "directive", next: "*" }
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        pathGroups: [
          {
            pattern: "@bmi/**",
            group: "external",
            position: "after"
          }
        ]
      }
    ],
    "import/newline-after-import": ["error", { count: 1 }],
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-object-injection": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-unsafe-regex": "error"
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    }
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
          version: "detect"
        }
      },
      excludedFiles: ["*.test.tsx"],
      rules: {
        "no-console": "error"
      }
    },
    {
      files: ["**/*.jsx"],
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
          "error",
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
      files: ["*.test.{js,ts,tsx}"],
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
      files: ["**/__mocks__/**/*.js"],
      env: {
        node: true,
        jest: true
      }
    },
    {
      files: ["**/migrate/**/migrations/**/*.js"],
      rules: {
        strict: "off"
      }
    }
  ]
};
