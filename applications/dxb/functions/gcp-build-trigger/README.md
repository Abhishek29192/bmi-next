# Build Trigger

Google Cloud Platform function to trigger site build once the delta message from PIM has been handled.

## Metric response

The Metric API responds with a list of 3 values, the time series data, the request and the response. As can be seen from the real world sample responses, the request and response can be and are `null`, but the TypeScript type definition _only_ states the request can be `null`. Fortunately we don't currently care about these values, so it's not an issue.The TypeScript definition _also_ states that the time series data can have a list of objects which don't have values, but I have yet to see this in any real response, but it's best to take care of that if the TypeScript definition allows it.

### See actual response

First of all, authenticate yourself with GCP by running `gcloud auth application-default login`. Then the below script can be run to see a real output for the given metric (replace the `metric.type` to which ever you want and the `startTime` if an empty response is being returned, e.g. `seconds - 86400` for 1 day).

```javascript
"use strict";

const monitoring = require("@google-cloud/monitoring");

const client = new monitoring.MetricServiceClient();

const main = async () => {
  const now = new Date();
  const seconds = Math.round(now.getTime() / 1000);

  const results = await client.listTimeSeries({
    name: `projects/bmi-np-dxb-compute-qa`,
    filter: `metric.type = "firestore.googleapis.com/document/write_count"`,
    interval: {
      endTime: { seconds: seconds },
      startTime: { seconds: seconds - 240 }
    },
    view: "FULL"
  });

  console.log(JSON.stringify(results, null, 2));
};

main();
```

### No data points for the time span

```json
[[], null, null]
```

### With data points for the time span

```json
[
  [
    {
      "points": [
        {
          "interval": {
            "startTime": {
              "seconds": "1663256640",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663256700",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "0",
            "value": "int64Value"
          }
        },
        {
          "interval": {
            "startTime": {
              "seconds": "1663256580",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663256640",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "636",
            "value": "int64Value"
          }
        },
        {
          "interval": {
            "startTime": {
              "seconds": "1663256520",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663256580",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "868",
            "value": "int64Value"
          }
        }
      ],
      "metric": {
        "labels": {
          "module": "__unknown__",
          "op": "CREATE",
          "version": "__unknown__"
        },
        "type": "firestore.googleapis.com/document/write_count"
      },
      "resource": {
        "labels": {
          "project_id": "bmi-np-dxb-compute-qa"
        },
        "type": "firestore_instance"
      },
      "metricKind": "DELTA",
      "valueType": "INT64",
      "metadata": null,
      "unit": ""
    },
    {
      "points": [
        {
          "interval": {
            "startTime": {
              "seconds": "1663334040",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663334100",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "0",
            "value": "int64Value"
          }
        },
        {
          "interval": {
            "startTime": {
              "seconds": "1663333980",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663334040",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "0",
            "value": "int64Value"
          }
        },
        {
          "interval": {
            "startTime": {
              "seconds": "1663333920",
              "nanos": 0
            },
            "endTime": {
              "seconds": "1663333980",
              "nanos": 0
            }
          },
          "value": {
            "int64Value": "1",
            "value": "int64Value"
          }
        }
      ],
      "metric": {
        "labels": {
          "op": "UPDATE_NOOP",
          "module": "__unknown__",
          "version": "__unknown__"
        },
        "type": "firestore.googleapis.com/document/write_count"
      },
      "resource": {
        "labels": {
          "project_id": "bmi-np-dxb-compute-qa"
        },
        "type": "firestore_instance"
      },
      "metricKind": "DELTA",
      "valueType": "INT64",
      "metadata": null,
      "unit": ""
    }
  ],
  null,
  null
]
```
