# InTouch Frontend

## Project Background

To know more about BMI InTouch, see the related [Confluence documents](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1858797800/Technical+Blueprint).

## Getting Started

- First, follow the monoropo instructions (root directory README). You should have installed all the necessary dependencies.

- open your `/etc/hosts` and add the following line: `127.0.0.1 local.intouch`

- run `yarn workspace @bmi/intouch-frontend dev` from the monorepo root directory

- visit [http://local.intouch:3000/](http://local.intouch:3000/)

- visit [http://local.intouch:3000/api/graphql](http://local.intouch:3000/api/graphql) to work directly on the apollo federated server without need to use the auth0 token

The `AUTH0_COOKIE_DOMAIN` define when using multi market or single market.

If you set `AUTH0_COOKIE_DOMAIN=localhost` the login cookie is set on the localhost domain and you will be able to run the app as single market opening `http://localhost:3000`

If you set `AUTH0_COOKIE_DOMAIN=local.intouch` and you add these domain in yout /etc/hosts:

```
127.0.0.1       en.local.intouch
127.0.0.1       it.local.intouch
127.0.0.1       de.local.intouch
127.0.0.1       us.local.intouch
127.0.0.1       es.local.intouch
127.0.0.1       no.local.intouch
```

you will be able to run the app in multimarket in all the above domains.

When you run with multimarket and you register a user with the `en` subdomain and you try to access to another subdomain you will be redirected to the `en` subdomain.

## Workspaces

See the [Work with Workspaces](https://gitlab.com/bmi-digital/dxb#work-with-workspaces) section in the monorepo root README file.

### Importing a new component/library from other packages

See [monorepo root README](https://gitlab.com/bmi-digital/dxb/-/tree/master#work-with-workspaces).

Example: `yarn workspace @bmi/intouch-frontend add @bmi/button@0.0.0`

## TypeScript code generation

We use the [GraphQL code generator](https://www.graphql-code-generator.com/) tools to create the TypeScript types in our frontend.

See [graphql-code-generator README](https://github.com/dotansimha/graphql-code-generator#readme).

## Some Gotcha's

- The React version in this directory's `package.json` needs to be the same as the React version used by the DXB components.
