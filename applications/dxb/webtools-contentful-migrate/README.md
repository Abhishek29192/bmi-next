# Web Tools Contentful Migrate

## Setup

Copy the `.env.example` file to `.env` and enter the appropriate values.

### Environment variables

| Variable name           | Description                                         | Possible values                                  | Default value |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------ | ------------- |
| CONTENTFUL_ENVIRONMENT  | The alias _or_ environment name to be updated.      | String name of the existing alias or environment | `undefined`   |
| MANAGEMENT_ACCESS_TOKEN | The access token for the Contentful Management API. | String of the access token                       | `undefined`   |
| MIGRATION_DRY_RUN       | Whether this should be a dry run.                   | `true` or `false`                                | `false`       |
| SPACE_ID                | The ID of the Contentful Space.                     | String of the ID for the Contentful space        | `undefined`   |

## Initialise environment

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the current state of each managed content type.

_N.B. This is only needed for empty spaces, not for spaces that have already been initialized._

```bash
yarn workspace @bmi/webtools-contentful-migrate run ctf-migrate init
```

## Create migration script template

```bash
yarn workspace @bmi/webtools-contentful-migrate run ctf-migrate create <migration-file-name-without-timestamp> -c scripts
```

## Migrate up

This simply runs the up functions for the migration scripts.

```bash
yarn workspace @bmi/webtools-contentful-migrate up
```

## Migrate down

This simply runs the down functions for the migration scripts.

```bash
yarn workspace @bmi/webtools-contentful-migrate down <filename-to-run-down-to>
```
