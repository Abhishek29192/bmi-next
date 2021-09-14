# PIM products Firestore writer

Google Cloud Platform function writing products data from PIM to DXB firestore.

## Example message

```javascript
{
  message: {
    data: Buffer.from(
      JSON.stringify({
        type: "UPDATED",
        itemType: "PRODUCTS | SYSTEMS | CATEGORIES",
        items: [
          {
            code: "EXAMPLE_PRODUCT_CODE"
            // .. and the rest of the product
          }
        ]
      }),
      "ascii"
    ).toString("base64");
  }
}
```
