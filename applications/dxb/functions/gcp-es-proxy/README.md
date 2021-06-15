# Elastic Seach PIM Products data ingest function

This function is intended to be triggered by GCP Pub/Sub with messages that will contain PIM products data.
It will then transform that data into the shape needed for `@bmi/head` to use on PLP pages when querying ES for product variants.

## Testing

You can run the function locally using:

```shell
$ yarn dev
```

> Notes WIP, see root README for now
