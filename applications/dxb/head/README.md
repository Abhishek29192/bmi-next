# Head Website

We use [Gatsby](https://www.gatsbyjs.org/) to generate static website and it's data comes from the `gatsby-source-contentful` plugin.

## Configuration

### Create environment files

1. Copy `applications/dxb/head/.env.example` to `applications/dxb/head/.env.development`
1. Copy `libraries/migrate/.env.example` to `libraries/migrate/.env.development`
1. Set `PROJECT_RELATIVE_PATH` to `projects/dxb` in `libraries/migrate/.env.development`

### Setup your own Contentful account and space for local development

#### Create Contentful account

1. Go to [Contentful sign up](https://www.contentful.com/sign-up/)
1. Sign up with your BMI (Google) account

#### Create development space

1. In the "burger" menu, click `Add a space`, under your personal organisation
1. Select `Community space`
1. Select `Web app only`
1. Click `Continue`
1. Enter a name for your space (such as `local`)
1. Ensure `Empty space` is selected
1. Click `Create space`
1. Cick `Go to my space home`
1. Go to `Settings > General settings`
1. Click on the `Copy to clipboard` button next to `Space ID`
1. Paste into `applications/dxb/head/.env.development` as `SPACE_ID`
1. Set `ENVIRONMENT` as `master` in `applications/dxb/head/.env.development`
1. Paste into `libraries/migrate/.env.development` as `SPACE_ID`
1. Set `CONTENTFUL_ENVIRONMENT` as `master` in `libraries/migrate/.env.development`

Once completed, you will have a space that can be used for your own development purposes and will have a `master` environment already created, so that you don't need to make changes or run your migration directly on DXB's Contentful account.

#### Acquire access to DXB's Large Space

Talk to one of the other devs to give you access to the DXB `Large Space` (which is actually the Norway space, but the `development` environment is used for QA).

#### Install custom apps

1. Go to your own personal space
1. Go to `Apps > Manage apps`
1. Install `Image Focal Point` from the list on the page, using the default values
1. Go back to `Manage apps > Manage private apps > Create an app`
1. Create `Conditional fields` and `Field editors`

##### Conditional Fields

Name: `Conditional fields`
Frontend: `https://bmi-dxb-contentful-integrations-production.netlify.app/conditional-fields`
Locations: `Entry editor`

##### Field editors

Name: `Field editors`
Frontend: `http://localhost:3000/field-editors`
Locations: `Entry field > JSON object`

#### Add extensions

1. Go to your personal space
1. Go to `Settings > Extensions`
1. Create `Contentful Tables` and `Slug Generator`
   1. Go to `Add extension > Add a new extension`

##### Contentful Tables:

Name: `Contentful Tables`
Field types: `Object`
Hosting: `Hosted by Contentful (srcdoc)`
Code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Tables for Contentful UI</title>
    <link
      rel="stylesheet"
      href="https://contentful.github.io/ui-extensions-sdk/cf-extension.css"
    />
    <script src="https://contentful.github.io/ui-extensions-sdk/cf-extension-api.js"></script>
    <style>
      div.input-container {
        display: inline-block;
        vertical-align: top;
        width: 4rem;
        margin: 0 1rem 1rem 0;
      }
      div.input-container label {
        color: #718096;
        display: block;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 2px;
      }
      div.input-container input {
        display: block;
        color: #1a202c;
        border: 1px solid #cbd5e0;
        font-size: 0.875rem;
        line-height: 1.5rem;
        padding: 0.5rem;
        text-align: center;
        width: 100%;
      }

      table {
        border-collapse: collapse;
        table-layout: auto;
        width: 100%;
      }

      th {
        color: #2d3748;
        font-size: 1rem;
        padding: 0;
      }

      td {
        border: 1px solid #cbd5e0;
        color: #1a202c;
        font-size: 1rem;
        padding: 0;
      }

      tr:first-child td input {
        font-weight: bold;
        text-align: center;
      }

      td input {
        border: none;
        color: #1a202c;
        font-size: 1rem;
        line-height: 1.5;
        padding: 0.5rem 1rem;
        text-align: center;
        width: 100%;
      }

      input:hover {
        background-color: #f7fafc;
      }
      input:focus {
        background-color: #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div id="content">
      <table></table>
    </div>
    <script>
      function getInitialData({ rows, header }) {
        const data = [header];
        const columns = data[0].length;

        for (let i = 0; i < rows; i++) {
          data.push(new Array(data[0].length));
        }

        return data;
      }

      function alterData(data) {
        if (document.querySelector("#rows").value < data.length) {
          data.length = document.querySelector("#rows").value;
        } else {
          for (
            let i = data.length;
            i < document.querySelector("#rows").value;
            i++
          ) {
            data.push(new Array());
          }
        }

        for (let i = 0; i < data.length; i++) {
          if (document.querySelector("#columns").value < data[i].length) {
            data[i].length = document.querySelector("#columns").value;
          } else {
            for (
              let j = data[i].length;
              j < document.querySelector("#columns").value;
              j++
            ) {
              data[i].push("");
            }
          }
        }

        return data;
      }

      function createDOMTable(elem, tableData) {
        while (elem.rows.length > 0) {
          elem.deleteRow(0);
        }

        for (let i = 0; i < tableData.length; i++) {
          let row = elem.insertRow();

          for (let j = 0; j < tableData[0].length; j++) {
            row.insertCell().innerHTML = `<input data-row="${i}" data-column="${j}" value="${
              tableData[i][j] || ""
            }"/>`;
          }
        }
      }

      function capitalizeWord(s) {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
      }

      window.contentfulExtension.init((extension) => {
        let value = extension.field.getValue();

        if (!value) {
          value = {
            tableData: getInitialData({
              rows: 3,
              header: ["Column 1", "Column 2"]
            })
          };
        }

        createDOMTable(document.querySelector("table"), value.tableData);

        let inputSizes = ["rows", "columns"];
        for (input in inputSizes) {
          let inputContainer = document.createElement("div");
          let inputLabel = document.createElement("label");
          let inputEl = document.createElement("input");
          inputEl.id = inputSizes[input];
          inputEl.classList.add("size-input");
          if (inputSizes[input] == "rows") {
            inputEl.placeholder = "2";
            inputEl.value = value.tableData.length;
          } else {
            inputEl.placeholder = "3";
            inputEl.value = value.tableData[0].length;
          }
          inputEl.addEventListener(
            "change",
            (e) => {
              value = {
                tableData: alterData(value.tableData)
              };
              createDOMTable(document.querySelector("table"), value.tableData);
              extension.window.updateHeight();
              extension.field.setValue(value);
            },
            true
          );
          inputContainer.classList.add("input-container");
          inputLabel.textContent = capitalizeWord(inputSizes[input]);
          inputContainer.appendChild(inputLabel);
          inputContainer.appendChild(inputEl);
          document.body.insertBefore(
            inputContainer,
            document.body.childNodes[0]
          );
          extension.window.updateHeight();
        }

        window.addEventListener(
          "change",
          (e) => {
            if (e.target.classList.contains("size-input")) return false;
            value.tableData[e.target.dataset.row][e.target.dataset.column] =
              e.target.value;
            extension.field.setValue(value);
          },
          true
        );
      });
    </script>
  </body>
</html>
```

#### Slug Generator

Name: `Slug Generator`
Field types: `Symbol`
Hosting: `Hosted by Contentful (srcdoc)`
Code:

```html
<!DOCTYPE html>
<head>
  <link
    href="https://static.contentful.com/app/main-62e0abc7.css"
    media="all"
    rel="stylesheet"
    type="text/css"
  />
  <link
    href="https://static.contentful.com/app/vendor-976872d7.css"
    media="all"
    rel="stylesheet"
    type="text/css"
  />
  <link
    href="https://contentful.github.io/ui-extensions-sdk/cf-extension.css"
    media="all"
    rel="stylesheet"
    type="text/css"
  />
  <script
    type="text/javascript"
    src="https://unpkg.com/contentful-ui-extensions-sdk@3"
  ></script>
</head>
<div class="widget-slug-editor">
  <input
    id="slug"
    type="text"
    class="form-control"
    style="width: 98%; font-size: 14px"
  />
  <i id="error" class="fa fa-exclamation-triangle is-slug-duplicate"></i>
  <i id="ok" class="fa fa-check-circle is-slug-unique"></i>
  <i id="loading" class="fa fa-spinner fa-spin"></i>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/speakingurl/7.0.0/speakingurl.min.js"></script>

<script>
  var cfExt = window.contentfulExtension || window.contentfulWidget;

  cfExt.init(function (api) {
    var slugField = api.field;
    var titleFieldName = api.contentType.displayField;
    var titleField = api.entry.fields[titleFieldName];

    var _ = window._;
    // var getSlug = window.getSlug // What was this? ~ Dan
    var debouncedUpdateStatus = _.debounce(updateStatus, 500);

    var input = document.getElementById("slug");
    var statusElements = {
      error: document.getElementById("error"),
      ok: document.getElementById("ok"),
      loading: document.getElementById("loading")
    };

    console.log({ slugField, input, titleField });

    api.window.updateHeight();

    input.value = slugField.getValue() || getSlug(titleField.getValue()); // ~ Dan

    var initialValueIsBlank = input.value == "";

    titleField.onValueChanged(handleSlugChangeByTitle);

    input.addEventListener("input", function () {
      handleSlugChange(input.value);
    });
    input.addEventListener("change", function () {
      handleSlugChange(input.value);
    });

    updateStatus(slugField.getValue());

    /**
     * Check if the status of the entry is published
     */
    function checkIsPublished() {
      return api.entry.getSys().publishedCounter > 0;
    }

    /**
     * Overriding getSlug to do something more simple ~ Dan.
     */
    function getSlug(value) {
      return value ? value.replace(/ /g, "-").toLowerCase() : "";
    }

    /**
     * Handle change of slug value caused by changing slug field
     */
    function handleSlugChange(value) {
      setSlug(getSlug(value || ""));
    }

    /**
     * Handle change of slug value caused by changing the title of the entry
     */
    function handleSlugChangeByTitle(value) {
      if (checkIsPublished() || !initialValueIsBlank) {
        return;
      }

      setSlug(getSlug(value || ""));
    }

    /**
     * Set the input value to 'slug' and update the status by checking for
     * duplicates.
     */
    function setSlug(slug) {
      input.value = slug;
      slugField.setValue(slug);
      setStatus("loading");
      debouncedUpdateStatus(slug);
    }

    /**
     * Show inline status icon based on current status
     */
    function updateStatus(slug) {
      getDuplicates(slug).then(function (hasDuplicates) {
        if (hasDuplicates) {
          setStatus("error");
        } else {
          setStatus("ok");
        }
      });
    }

    /**
     * Show icon for given status
     */
    function setStatus(status) {
      _.each(statusElements, function (el, name) {
        if (name === status) {
          el.style.display = "inline";
        } else {
          el.style.display = "none";
        }
      });
    }

    /**
     * Check if slug is already in use.
     * Resolves to 'true' if there are entries of the given content type that have
     * the same 'slug' value.
     */
    function getDuplicates(slug) {
      if (!slug) {
        return Promise.resolve(false);
      }

      var query = {};

      query["content_type"] = api.entry.getSys().contentType.sys.id;
      query["fields." + slugField.id] = slug;
      query["sys.id[ne]"] = api.entry.getSys().id;
      query["sys.publishedAt[exists]"] = true;

      return api.space.getEntries(query).then(function (result) {
        return result.total > 0;
      });
    }
  });
</script>
```

#### Create personal access token

1. Go to `Account settings`
1. Go to `Tokens > Personal access tokens`
1. Click on `Generate personal token`
1. Enter a `Token name` (such as `local`)
1. Click `Generate`
1. Click the `Copy to clipboard` button and _do not click `Done`_ as we need to make sure we've stored it somewhere useful
1. Paste into `applications/dxb/head/.env.development` as `ACCESS_TOKEN`
1. Paste into `libraries/migrate/.env.development` as `ACCESS_TOKEN`
1. Click `Done` on the `Generate Personal Access Token` modal in Contentful

#### Create content model

Follow the steps under [migrate initialise](../../../libraries/migrate/README.md#Initialise) and then [migrate up](../../../libraries/migrate/README.md#Up).

#### Populate personal development space

1. Open up a terminal
1. Navigate to where this repo has been cloned to
1. Install relevant dependencies `yarn install`
1. Initialise personal Contentful space to use migration scripts using `yarn migrate init`
1. Create content model in personal Contentnful space using `yarn migrate up -a -e master`
1. Install `contentful-cli` globally using `yarn global add contentful-cli`
1. Export the DXB `development` environment using `contentful space export --space-id <DXB SPACE ID> --environment-id development --mt <YOUR PERSONAL ACCESS TOKEN> --include-drafts --skip-roles --skip-webhooks --skip-content-model --content-file dump.json`
1. Import the newly created JSON dump into your personal development space using `contentful space import --space-id <YOUR OWN ACC SPACE ID> --environment-id master --mt <YOUR PERSONAL ACCESS TOKEN> --content-file dump.json`

Once the import is complete, it is likely a large printout will appear mentioning that errors occured. This is where there are content in DXB's `development` environment, stopping them from being published. However, this isn't an issue as everything will have been successfullly imported into your new environment.

### Feature Flags

GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE -
feature flag for new PDP page url structure
Default is `false` (and current url structure is displayed e.g. `/p/roof-products/zanda-protector-normalstein/svart/935895622/`)
When set to `true` only the new url structure will be shown for PDP pages (e.g. `/p/zanda-protector-normalstein-sort-betong-935895622`)

GATSBY_ENABLE_OLD_PDP_URL_REDIRECTS -
Feature flag for generating redirects for PDP URLs, see `gatsby-node.js`
Default is `false` (will not generate redirects)
When set to `true` (will generate permanent redirect for old to new PDP url scheme e.g. from `/p/roof-products/zanda-protector-normalstein/svart/935895622/` to `/p/zanda-protector-normalstein-sort-betong-935895622`. redirects will be created at post build time)

GATSBY_HIDE_RECOMMENDED_PRODUCTS -
feature flag for show/hide recommended products on PDP
Default is `false` (will not hide recommended products)
When set to `true` will hide recommended products on PDP

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

## Run Gatsby

To run develop

```shell
$ yarn workspace @bmi/head dev
```

To build the production ready website

```shell
$ yarn workspace @bmi/head start
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

## New Relic

There is a Gatsby plugin which we can use to get some metrics for our build. To be able to do this, an account is needed.

### Create free account

Visit [New Relic](https://newrelic.com/signup) and sign up for a new account.

### Get an API key

1. Go to accounts (top right)
1. Go to `API keys`
1. Create an `Ingest - License` key
1. Populate `NEW_RELIC_LICENSE_KEY` with the new license key
1. Populate `NEW_RELIC_ACCOUNT_ID` with your account ID
1. Populate `NEW_RELIC_SITE_NAME` with `DXB`

### Setup a dashboard

1. Go to [Gatsby Builds Quickstart](https://newrelic.com/instant-observability/gatsby-build/d234c09c-3338-4713-8340-ca75766445d6)
1. Scroll to the bottom and click `Install now`
1. Follow the installation wizard, _skipping the installation step as it's already done_

### Collecting metrics

To get metrics from the build, set `PERFORMANCE_ANALYTICS` to `true`.

## Performance run

Once a New Relic account has been created and the environment variables have been setup, `yarn workspace @bmi/head performance` can be run to get some performance metrics. This will run the standard `build` script, but with `--graphql-tracing` to get the full set of metrics. It also sets `NODE_ENV` to `production`, to ensure that a build is run as if it were for production, so make sure there is a `.env.production` env file with all the necessary properties set.
