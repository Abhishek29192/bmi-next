# gcp-pim-preview-firestore-writer

Google Cloud Platform function writing preview products data from PIM to DXB firestore.

## Example payload

```javascript
{
  product: PimProduct,
  locale: string
}
```

## Build

```bash
yarn workspace @bmi/gcp-pim-preview-firestore-writer build
```

Functions are build into the `dist` directory.

## Development

Create .env and copy the content of .env.example (set the value as needed).

This function uses GCP storage account. Set the authentication to GCP - https://cloud.google.com/docs/authentication/getting-started

To run a function in dev mode:

```bash
yarn workspace @bmi/gcp-pim-preview-firestore-writer dev
```
