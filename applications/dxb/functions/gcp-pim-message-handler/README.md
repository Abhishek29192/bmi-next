# PIM message handler

Google Cloud Platform function handling incoming messages from PIM informing DXB about changes to PIM products.

## Example messages

### Raw message

```json
{
  "message": {
    "data": "eyJjYXRhbG9nIjoibm9yd2F5UHJvZHVjdENhdGFsb2ciLCJ0b2tlbiI6ImNjODg2NTRjYTkwNTQzZGViYTQ4Zjk5ZWExNjhjODI1IiwidGltZXN0YW1wIjoxNjA1MTg1MjM2MTk0LCJ0eXBlIjoiVVBEQVRFRCIsImJhc2VTaXRlIjoibm9yd2F5Qm1pIiwiZW5kUG9pbnRVcmwiOiIvZXhwb3J0cy9jYXRlZ29yaWVzIiwiaXRlbVR5cGUiOiJDQVRFR09SSUVTIn0=",
    "messageId": "1733548933999887",
    "message_id": "1733548933999887",
    "publishTime": "2020-11-20T11:18:17.816Z",
    "publish_time": "2020-11-20T11:18:17.816Z"
  },
  "subscription": "projects/bmi-pim-nextgen/subscriptions/norwayProductCatalog-dxb-dev-sub"
}
```

### Category update message (unused)

Base64 encoded from the `message.data` property of a raw message.

```json
{
  "catalog": "norwayProductCatalog",
  "token": "cc88654ca90543deba48f99ea168c825",
  "timestamp": 1605185236194,
  "type": "UPDATED",
  "baseSite": "norwayBmi",
  "endPointUrl": "/exports/categories",
  "itemType": "CATEGORIES"
}
```

### Product update message

Base64 encoded from the `message.data` property of a raw message.

```json
{
  "catalog": "norwayProductCatalog",
  "token": "133632d4e488440baac7d2ea94b5a83b",
  "timestamp": 1596712373278,
  "type": "UPDATED",
  "baseSite": "norwayBmi",
  "endPointUrl": "/exports/products",
  "itemType": "PRODUCTS"
}
```

### System configurator update message

Base64 encoded from the `message.data` property of a raw message.

```json
{
  "catalog": "norwayProductCatalog",
  "token": "133632d4e488440baac7d2ea94b5a83b",
  "timestamp": 1596712373278,
  "type": "UPDATED",
  "baseSite": "norwayBmi",
  "endPointUrl": "/exports/systems",
  "itemType": "SYSTEMS"
}
```
