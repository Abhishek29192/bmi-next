# Elastic Search PIM Systems data ingest function

This function is intended to be triggered by GCP Pub/Sub with messages that will contain PIM system data.
It will then transform that data into the shape needed for `@bmi/head` toto tailor and display the recommended system(s) to users based on their inputs on the system configurator builder.

## Testing

You can run the function locally using:

```shell
$ yarn dev
```

> Notes WIP, see root README for now
