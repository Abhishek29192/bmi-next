# Functions

`/functions` folder contains packages which are individual Google Cloud Platform functions.
Each function should have a `dev` script which can be used to serve it on localhost using `functions-framework`.
This addmitedly makes sense for HTTP triggered functions, but it will host event triggered functions just the same, however locally the message (which should be the body of the request) is available in `context.message` rather than `event`.

Each function should also have a `deploy` script, which can be used to, you guessed it, deploy the function into Google Cloud Platform.
This requires gcloud to be configured on your machine.

https://cloud.google.com/sdk/docs/install

After installing you will need to setup using:

```shell
$ gcloud init
```

For which you will likely need the project name from GCP.
