# Contentful Migrations

We use our own [Contentful Migration](https://gitlab.com/bmi-digital/contentful-migration) library to handle the migrations with Contentful.

## Project documentation

- [DXB](/applications/dxb/contentful-migrate/README.md)
- [InTouch](/applications/intouch/contentful-migrate/README.md)
- [Web Tools](/applications/dxb/webtools-contentful-migrate/README.md)

## Testing changes

To be able to test the changes for some of our projects requires a P1X space environment as a community space environment will not be sufficient for number of content types that are used. Therefore, the process to test the scripts is:

1. Create a new environment in the non-market specific space
1. Test the script changes against this new environment
   1. Make sure that the changes are run as an incremental change ontop of the latest set of scripts (so when it is run against the real environments, we know it will work reliably)
   1. Make sure that the changes are run against a completely cleared down environment (so we know it will work reliably against a brand new environment)
1. Delete the environment
   1. A space has a limited number of environments, so to allow other devs to be able to complete their own work, cleanup is required

### Install Contentful CLI

```bash
yarn global add contentful-cli
```

### Login to Contentful

```bash
contentful login
```

### Create an empty test environment

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment create --space-id $CONTENTFUL_SPACE_ID --name $CONTENTFUL_ENVIRONMENT --environment-id $CONTENTFUL_ENVIRONMENT
```

### Create pre-populted test environment

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment create --space-id $CONTENTFUL_SPACE_ID --name $CONTENTFUL_ENVIRONMENT --environment-id $CONTENTFUL_ENVIRONMENT --source master
```

### Delete test environment

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment delete --space-id $CONTENTFUL_SPACE_ID --environment-id $CONTENTFUL_ENVIRONMENT
```
