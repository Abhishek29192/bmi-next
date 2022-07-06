# Functions Deployer

## Build

```bash
yarn run @bmi/gcp-functions-deployer build
```

Functions are build into the `dist` directory.

## Development

Create .env.yaml and copy the content of .env.example.yaml (set the value as needed).

This function uses GCP storage account. Set the authentication to GCP - https://cloud.google.com/docs/authentication/getting-started

To run a function in dev mode:

```bash
yarn workspace @bmi/gcp-functions-deployer dev
```
