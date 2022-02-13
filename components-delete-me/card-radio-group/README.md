A controlling container for [CardInput](/#/CardInput).

## Variants

### Default

```jsx
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

<CardRadioGroup name="tileType" onChange={console.log}>
  <CardRadioGroup.Item
    value="Zanda Arktis"
    title="Zanda Arktis"
    imageSource={demoFormattedImage}
  >
    <CardRadioGroup.Item.Paragraph>6 colours</CardRadioGroup.Item.Paragraph>
  </CardRadioGroup.Item>
  <CardRadioGroup.Item
    value="Aerodek Traditional"
    title="Aerodek Traditional"
    imageSource={demoImage}
  >
    <CardRadioGroup.Item.Paragraph>6 colours</CardRadioGroup.Item.Paragraph>
  </CardRadioGroup.Item>
</CardRadioGroup>;
```

### With initial value

```jsx
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

<CardRadioGroup name="tileType2" defaultValue={"Zanda Arktis"}>
  <CardRadioGroup.Item
    value="Zanda Arktis"
    title="Zanda Arktis"
    imageSource={demoFormattedImage}
  >
    <CardRadioGroup.Item.Paragraph>6 colours</CardRadioGroup.Item.Paragraph>
  </CardRadioGroup.Item>
  <CardRadioGroup.Item
    value="Aerodek Traditional"
    title="Aerodek Traditional"
    imageSource={demoImage}
  >
    <CardRadioGroup.Item.Paragraph>6 colours</CardRadioGroup.Item.Paragraph>
  </CardRadioGroup.Item>
</CardRadioGroup>;
```
