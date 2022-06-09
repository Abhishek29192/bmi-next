# Contentful Default Values CLI

## Build

```bash
yarn run @bmi/contentful-default-values-cli build
```

CLI is build into the `dist` directory.

## Development / Production

Create .env and copy the content of .env.example (set the value as needed).

To run the CLI (example is given for the Finland market)

### Parameters

- `market__finland`: DXB market tag
- `fi-FI`: Locale (Multiple locales can be passed in separated by spaces)

```bash
yarn workspace @bmi/contentful-default-values-cli start market__finland fi-FI
```
