# Netlify Functions

All the functions that are to be deployed/run on [Netlify](https://docs.netlify.com/functions/overview/).

Follow the steps in the [root README](../../README.md#Run%20Netlify%20locally) to run Netlify locally.

## Create function

To create a new function, run the below command. To be triggered by [specific events](https://docs.netlify.com/functions/trigger-on-events), the function needs to be named after the event.

```bash
netlify functions:create --name [function name]
```

## Run locally

```bash
netlify dev # to start the dev server to host the function
netlify functions:invoke [function name] --payload '{}'
```
