# Head Website

We use [Gatsby](https://www.gatsbyjs.org/) to generate static website and it's data comes from the `gatsby-source-contentful` plugin.

## Configuration

Before running the website (`applications/head`), make sure you copy the `.env.example` file to `.env.development` (based on the `NODE_ENV`).

Comment out the first set of variables: `COUNTRY_CODE`, `SPACE_ID`, and `ACCESS_TOKEN`.

You can find the `SPACE_ID_n` and `ACCESS_TOKEN_n` values in Contentful API keys section.
`COUNTRY_CODE` is the locale code e.g. `en_US`.

### Setup your own Contentful account and space for local development

Create a free Contentful account and create a space and a blank environment. This will act as your local development v environment so that you don't need to make changes or run your migration directly on DXB Contentful account.

Run the following command to clone content types and content from DXB `development` environment to your own account.

`yarn global add contentful-cli`

`contentful space export --space-id <DXB SPACE ID> --environment-id development --mt <DXB MANAGEMENT TOKEN> --include-drafts --skip-roles --skip-webhooks --content-file dump.json`

`contentful space import --space-id <YOUR OWN ACC SPACE ID> --environment-id <YOUR ACC ENVIRONMENT> --mt <YOUR OWN ACC MANAGEMENT TOKEN> --content-file dump.json`

Depending on how clean the content in dxb `development` environment, you might get some warning and error messages for unresolved resources but they wouldn't stop the whole cloning process and you will still get the rest of the data in your account.

Now you will have a clone of both content types and content from DXB development environment in your own account.
When you run your newly written migration script, now you can run them in this environment for testing.

Note that in .env.\* in `libraries/migrate` you should always put `<YOUR OWN ACC SPACE ID>` and `<YOUR OWN ACC MANAGEMENT TOKEN>` instead of the DXB one otherwise you are running migration directly on DXB contentful account!

You should also put `<YOUR OWN ACC SPACE ID>` and `<YOUR OWN ACC MANAGEMENT TOKEN>` in .env.\* in `applications/head` to use content and content type from your own accoun

### Feature Flags

GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE -
feature flag for new PDP page url structure
Default is `false` (and current url structure is displayed e.g. `/p/roof-products/zanda-protector-normalstein/svart/935895622/`)
When set to `true` only the new url structure will be shown for PDP pages (e.g. `/p/zanda-protector-normalstein-sort-betong-935895622`)

GATSBY_ENABLE_OLD_PDP_URL_REDIRECTS -
Feature flag for generating redirects for PDP URLs, see `gatsby-node.js`
Default is `false` (will not generate redirects)
When set to `true` (will generate permanent redirect for old to new PDP url scheme e.g. from `/p/roof-products/zanda-protector-normalstein/svart/935895622/` to `/p/zanda-protector-normalstein-sort-betong-935895622`. redirects will be created at post build time)

GATSBY_GROUP_BY_VARIANT -
Feature flag for grouping / collapsing PLP data with `variant` as opposed to `base product` (Elastic search indexing)
Default is `false` (will group/collapse by base Product code i.e. `baseProduct.code.keyword`)
When set to `true` (will group/collapse by variant code i.e. `code.keyword`)

### Setup Google reCAPTCHA

1. Visit (Google reCAPTCHA)[https://www.google.com/recaptcha/admin]
1. Click on the `+` to create a new key
1. Enter the Label as `localhost`
1. Select reCAPTCHA type as reCAPTCHA v3
1. Add `localhost` to the Domains
1. Accept the reCAPTCHA Terms of Service
1. Submit the form
1. Copy the Site Key to `Contentful > Site > Google Recaptcha ID`
1. Ensure that `Contentful > Site > Google Recaptcha Use Net?` is set to `No`

### Run Gatsby

To run develop

```shell
$ yarn dev
```

To build the production ready website

```shell
$ yarn start
```

## Update DAST context files

There are certain fields that aren't in plain text and aren't obvious what they do. The _easiest_ way to update the context file is:

1. Download [OWASP ZAP](https://www.zaproxy.org/download/)
1. Import context to update
1. Make changes
1. Test changes
   1. Run spider
   1. Run active scan
1. Export context
