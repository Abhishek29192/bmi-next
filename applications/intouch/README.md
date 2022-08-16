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

#### Working with the GraphQL playground UI

The easiest way to access the GraphQL Playground and try requesting data to the InTouch API is to:

- run the frontend: `yarn workspace @bmi/intouch-frontend dev`
- authenticate as a user
- go to http://localhost:3000/api/graphql
- try your queries/mutations

Under the hood, the next.js app is making a request with an Authorization header to the GraphQL Gateway.

#### Working with changes to Data Model and/or to Mock Data (Dev phase only)

This workflow is applicable for the development phase only before going live. Once the project is closer to going live, this flow will be managed via DB migrations.

Once the datamodel spreadsheet and or the mock data in it is updated, follow these steps.

- Run the datamodel migration scripts:
  - See the README in `applications/intouch/migrate-datamodel/README.md`.
  - Setup Google Cloud CLI and authenticate to your Google Cloud Account.
  - run the scripts in `@bmi/intouch-migrate-datamodel` as per instructions.
  - move over the generated sql files to the sql file location in the respective service folder location (e.g. `mv applications/intouch/migrate-datamodel/data/company.sql applications/intouch/api/services/companies/src/data/company.sql`)
  - check you are using local env vars on the service (use Keybase for reference)
  - run the migration script - **with local env vars** - for the respective service (companies or training), e.g. `@bmi/intouch-api-service-companies migrate-db`.
  - submit an MR with the changes to the schema/mock data.
  - run the same migrate-db script with the dev db env vars (see Keybase) to re-deploy the DB on dev.

## Contentful

### Querying Contentful directly

If you want to read content via API:

- go to https://app.contentful.com/spaces/{SPACE_ID}/api/keys
- go to `Content delivery / preview tokens`
- create a personal token
- make sure the environment you need is enabled by the token
- access the content from this link:
  https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}/environments/{ENVIRONMENT}/explore?access_token={YOUR_ACCESS_TOKEN}

### Contentful API Keys & Env vars

If you want to create content via API, or run migrations:

- go to https://app.contentful.com/spaces/opay6t6wwmup/api/keys
- go to `Content management tokens`
- create a personal token
- put it in `applications/dxb/contentful-migrate/.env.development`

Read `{dxb_root_folder}/README.md` `{dxb_root_folder}/docs/contentful-migrations.md` for more information on:

- Contentful setup
- Content Migrations
- Adding roles

### Contentful Mock data

Install `contentful-cli` globally using `yarn global add contentful-cli`.

#### Add mock data to Contentful

Mock data should be added directly in Contentful.

```bash
contentful space export \
  --space-id $SPACE_ID \
  --environment-id $CONTENTFUL_ENVIRONMENT \
  --management-token $MANAGEMENT_ACCESS_TOKEN \
  --export-dir $PROJECT_RELATIVE_PATH/mocks \
  --download-assets \
  --skip-content-model \
  --skip-webhooks \
  --content-file content.json
```

#### Take a snapshot of data from Contentful

We can save a particular snapshot of the trial space.

```bash
contentful space import \
  --space-id $SPACE_ID \
  --environment-id $CONTENTFUL_ENVIRONMENT \
  --management-token $MANAGEMENT_ACCESS_TOKEN \
  --export-dir applications/intouch/contentful-migrate/src/mocks \
  --skip-content-model \
  --content-file applications/intouch/contentful-migrate/src/mocks/content.json
```
