# InTouch Frontend

## Project Background

To know more about BMI InTouch, see the related [Confluence documents](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1858797800/Technical+Blueprint).

## Getting Started

- First, follow the monoropo instructions (root directory README). You should have installed all the necessary dependencies.

- Create self-signed certificate
  `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

- Move the cert.pem & key.pem in the folder `./development-certs`

- run `yarn workspace @bmi/intouch-frontend dev-https` from the monorepo root directory

- visit [https://localhost:3000](https://localhost:3000)

### Problems with self-signed certificate?

If you are accessing the frontend on localhost, and you get an error on Chrome related to the https certificate try out [this solution](https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos/63539455#63539455).

## Workspaces

See the [Work with Workspaces](https://gitlab.com/bmi-digital/dxb#work-with-workspaces) section in the monorepo root README file.

### Importing a new component/library from other packages

See [monorepo root README](https://gitlab.com/bmi-digital/dxb/-/tree/master#work-with-workspaces).

Example: `yarn workspace @bmi/intouch-frontend add @bmi/button@0.0.0`

## TypeScript code generation

We use the [GraphQL code generator](https://www.graphql-code-generator.com/) tools to create the TypeScript types in our frontend.

See [graphql-code-generator README](https://github.com/dotansimha/graphql-code-generator#readme).

### Config

To pass configuration to GraphQL Codegen, We use a `codegen.yml`.

```
schema:
  - http://localhost:4000/graphql:
      headers:
        Authorization: "<Authorization Token>"
...
...
```

Replace the `<Authorization Token>` with your access_token from Auth0.

- run `yarn workspace @bmi/intouch-frontend codegen` from the monorepo root directory

## Some Gotcha's

- The React version in this directory's `package.json` needs to be the same as the React version used by the DXB components.
