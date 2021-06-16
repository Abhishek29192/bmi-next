# InTouch

## Background

### Onboarding resources

- **[Technical Blueprint](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1858797800/Technical%2BBlueprint)**
- **Data model**:
  - [document](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1856045059/Logical+data+model)
  - [spreadsheet](https://docs.google.com/spreadsheets/d/1AQdPdfB6CWNvGVHtsLziZb0lHjkvgmFHvtIMksVzDGk/edit?pli=1#gid=2097788557), also linked in the document
- **[InTouch Portal Designs]**(https://xd.adobe.com/view/fab09a47-4c50-48dc-ab0f-1b5e73f38eca-afe3/grid)
- [Rationale behind some technical decisions](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1870201022/Decisions+Rationale)
- [Contentful trial space](https://app.contentful.com/spaces/opay6t6wwmup/home)

## Setting up locally

### Frontend

See the `intouch/frontend/README.md` file to setup the frontend

### API

See the `intouch/api/README.md` to setup the graphql-gateway and the services.

## Contentful

### Querying Contentful directly

If you want to read content via API:

- go to https://app.contentful.com/spaces/{SPACE_ID}/api/keys
- go to `Content delivery / preview tokens`
- create a personal token
- make sure the environment you need is enabled by the token
- access the content from this link:
  https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}/environments/{ENVIRONMENT}/explore?access_token={YOUR_ACCESS_TOKEN}

### API Keys & Env vars

If you want to create content via API, or run migrations:

- go to https://app.contentful.com/spaces/opay6t6wwmup/api/keys
- go to `Content management tokens`
- create a personal token
- put it in `libraries/migrate/.env.development`

Read `{dxb_root_folder}/README.md` `{dxb_root_folder}/libraries/migrate/README.md` for more information on:

- Contentful setup
- Content Migrations
- Adding roles

### Mock data

Mock data should be added directly in Contentful. We can save a particular snapshot of the trial space, by running this script:

`yarn workspace @bmi/migrate content-download`

Make sure you have appropriately configured the env vars.

### Working with the GraphQL playground UI

The easiest way to access the GraphQL Playground and try requesting data to the InTouch API is to:

- run the frontend: `yarn workspace @bmi/intouch-frontend dev`
- authenticate as a user
- go to http://localhost:3000/api/graphql
- try your queries/mutations

Under the hood, the next.js app is making a request with an Authorization header to the GraphQL Gateway.

In order to impersonate users/roles/memberships, from the Auth0 dev tenant dashboard you can:

- change your `intouch_role`
- change your `intouch_user_id`
