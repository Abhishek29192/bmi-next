# gcp-docebo-data-filter

Google Cloud Platform function to filter out outdated Docebo sessions and trigger a new Gatsby build if sessions have been deleted.

## Build

```bash
yarn workspace @bmi/gcp-docebo-data-filter build
```

Functions are build into the `dist` directory.

## Development

First of all, the request for GCP Authorization token does not work locally. You need to comment that request and use `bearer` + result of executing `gcloud auth print-identity-token`:

```js
const token = "bearer gcp_auth_token_value";
```

Create .env and copy the content of .env.example (set the value as needed).

This function uses GCP storage account. Set the authentication to GCP - https://cloud.google.com/docs/authentication/getting-started

To run a function in dev mode:

```bash
yarn workspace @bmi/gcp-docebo-data-filter dev
```
