# InTouch Contentful Migrate

## Setup

Copy the `.env.example` file to `.env` and enter the appropriate values.

### Environment variables

| Variable name                        | Description                                         | Possible values                           | Default value |
| ------------------------------------ | --------------------------------------------------- | ----------------------------------------- | ------------- |
| CONTENTFUL_ENVIRONMENT               | The alias \_                                        |                                           |               |
| or\_ environment name to be updated. | String name of the existing alias or environment    | `undefined`                               |               |
| MANAGEMENT_ACCESS_TOKEN              | The access token for the Contentful Management API. | String of the access token                | `undefined`   |
| MIGRATION_DRY_RUN                    | Whether this should be a dry run.                   | `true` or `false`                         | `false`       |
| SPACE_ID                             | The ID of the Contentful Space.                     | String of the ID for the Contentful space | `undefined`   |

## Build the scripts

As our scripts are written in TypeScript, they need to be built before they can be run.

```bash
yarn workspace @bmi/intouch-contentful-migrate build
```

## Initialise environment

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the
current state of each managed content type.

_N.B. This is only needed for empty spaces, not for spaces that have already been initialized._

```bash
yarn workspace @bmi/intouch-contentful-migrate run ctf-migrate init
```

## Create migration script template

```bash
yarn workspace @bmi/intouch-contentful-migrate migrateCreate <migration-file-name-without-timestamp> <content-type>
```

## Migrate up

This simply runs the up functions for the migration scripts.

```bash
yarn workspace @bmi/intouch-contentful-migrate up
```

## Migrate down

This simply runs the down functions for the migration scripts.

```bash
yarn workspace @bmi/intouch-contentful-migrate down <filename-to-run-down-to> <content-type>
```

## Create roles

Custom roles with permissions can be added to a Contentful space by running the following script.

```bash
yarn workspace @bmi/intouch-contentful-migrate createRoles
```

The only way to migrate users is via the Content Management API (
read [here](https://www.contentfulcommunity.com/t/migration-of-custom-roles-and-users-from-one-space-to-other/789)).

The custom roles with permissions are specified in `applications/intouch/contentful-migrate/src/roles.ts`.

[This documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/roles)
shows some of the accepted key value pairs for roles & permissions.