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

## Feature Flags

GATSBY_ENABLE_PDP_VARIANT_ATTRIBUTE_URL - feature flag for `simple pdp url structure`, which a market can opt-in Default
is `false` (will generate URLs from product name, colour, materials, texture family and hashed code)
When set to `true` only the new url structure will use product name, variant attribute and hashed code

- If `variantAttribute` feature or its value is found then, it will
  generate `/p/zanda-protector-variant-atttr-value-935895622`
- If `variantAttribute` feature or its value is NOT found then, it will fall back to generate the standard
  URL `/p/zanda-protector-normalstein-sort-betong-935895622`
