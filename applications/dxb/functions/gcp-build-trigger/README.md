# PIM message handler

Google Cloud Platform function handling incoming messages from PIM informing DXB about changes to PIM products.

## Example message

```javascript
{
  message: {
    data:
      "eyJjYXRhbG9nIjoibm9yd2F5UHJvZHVjdENhdGFsb2ciLCJ0b2tlbiI6ImNjODg2NTRjYTkwNTQzZGViYTQ4Zjk5ZWExNjhjODI1IiwidGltZXN0YW1wIjoxNjA1MTg1MjM2MTk0LCJ0eXBlIjoiVVBEQVRFRCIsImJhc2VTaXRlIjoibm9yd2F5Qm1pIiwiZW5kUG9pbnRVcmwiOiIvZXhwb3J0cy9jYXRlZ29yaWVzIiwiaXRlbVR5cGUiOiJDQVRFR09SSUVTIn0=",
    messageId: "1733548933999887",
    message_id: "1733548933999887",
    publishTime: "2020-11-20T11:18:17.816Z",
    publish_time: "2020-11-20T11:18:17.816Z"
  },
  subscription:
    "projects/bmi-pim-nextgen/subscriptions/norwayProductCatalog-dxb-dev-sub"
}
```
