# InTouch Frontend

## Project Background

To know more about BMI InTouch, see the related [Confluence documents](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1858797800/Technical+Blueprint).

## Getting Started

- First, follow the monoropo instructions (root directory README). You should have installed all the necessary dependencies.

- open your `/etc/hosts` and add the following line: `127.0.0.1 intouch.local`

- run `yarn workspace @bmi/intouch-frontend dev` from the monorepo root directory

- visit [http://intouch.local:3000/](http://intouch.local:3000/)

- visit [http://intouch.local:3000/api/graphql](http://intouch.local:3000/api/graphql) to work directly on the apollo federated server without need to use the auth0 token

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
