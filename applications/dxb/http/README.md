# DXB HTTP Scripts

This is a collection of HTTP files that work in both IntelliJ and VSCode. These will work out of the box for IntelliJ, but VSCode requires the [httpYac - Rest Client](https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac) extension.

## \*.http files

The `*.http` files contain the requests that can be run.

### contentful.http

Requests against the Contentful APIs.

### elasticsearch.http

Requests against Elasticsearch.

### pim.http

Requests against the PIM APIs. For the requests to work, run the `Get authentication token` request, which will retrieve an access token and store it in the clients global store, so it can be used in the other requests.

## http-client.env.json

Contains the non-secret variables that the requests use.

## http-client.private.env.json

Needs to be created and contains the relevant secrets.

Example:

```
{
  "develop": {
    "esApiKey": "x",
    "pimClientId": "x",
    "pimClientSecret": "x",
    "contentfulToken": "x"
  },
  "qa": {
    "esApiKey": "x",
    "pimClientId": "x",
    "pimClientSecret": "x",
    "contentfulToken": "x"
  }
}

```

## How to use

### IntelliJ

Open up the relevant http file and click on the run icon in the left hand bar against the request that you want to run. This will bring up a little modal asking which environment you wish to run the request against.

### VSCode

Open up the relevant http file and click on the `env` option embedded at the top of file, just under the file breadcrumb, and select the relevant environment that you want the requests to run against. Then click on `send` above the request that you wish to run.
