# Elastic Seach PIM Products data ingest function

This function is intended to be triggered by GCP Pub/Sub with messages that will contain PIM products data.
It will then transform that data into the shape needed for `@bmi/head` to use on PLP pages when querying ES for product variants.

## Testing

You can run the function locally using:

```shell
$ yarn dev
```

## Running Elastic Search Locally

Assuming you have [docker running on your desktop] (https://www.docker.com/products/docker-desktop)

### Using local Elastic Search instance

```shell
$ docker compose up
```

Above command will use the `docker-compose.yml` and instantiate a new 'Elastic Search' instance and will be reachable at 'http://localhost:9200' and its 'Kibana' tools can be accessible at 'http://localhost:5601/app/kibana#/home'

you will need to update `.env.yml` with following two settings

- `ES_CLOUD_ID: "http://localhost:9200"`,
- `USE_LOCAL_ES: "true"`

This is to configure this gcp function to find elastic search instance at the above URL and to bypass security handshake.

after these settings are then run `yarn dev` in a new console instance.

Once this gcp function is running in dev mode it will be listening to `http://localhost:8080` and you can post base64 encoded PIM data json in the following format

```
{
    "data": {
        "data": "ew0KICAgICAgICAgICAgInR5cGUiOiAiVVBEQVRFRCIsDQogICAgICAgICAgICAiaXRlbVR5cGUiOiAiaXRlbVR5cGUiLA0KICAgICAgICAgICAgIml0ZW1zIjogWw0KICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgImFwcHJvdmFsU3RhdHVzIjogImFwcHJvdmVkIiwNCiAgICAgICAgICAgICAgICAgICAgImFzc2V0cyI6IFtdDQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgXQ0KICAgICAgICB9"
    }
}

```

## To view your indexes in local kibana instance you can run

```
GET /_cat/indices
```

## To search for documents in a given index you can run

```
GET /{YOUR_INDEX_NAME}/_search?pretty
```

```
GET /dxb_no_itemtype/_search?pretty
```

## To delete index, you can run

```
DELETE /{YOUR_INDEX_NAME}
```

```
DELETE /dxb_no_itemtype
```

> Notes WIP, see root README for now
