A controlling container for [CardInput](/#/CardInput).

## Variants

### Default

```jsx
import demoImage from "./__tests__/images/demo-product.jpg";
import demoFormattedImage from "./__tests__/images/demo-product-format.jpg";

<CardCheckboxGroup name="tileType" onChange={console.log}>
  <CardCheckboxGroup.Item
    value="Zanda Arktis"
    title="Zanda Arktis"
    imageSource={demoFormattedImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
  <CardCheckboxGroup.Item
    value="Aerodek Traditional"
    title="Aerodek Traditional"
    imageSource={demoImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
</CardCheckboxGroup>;
```

### With initial value

```jsx
import demoImage from "./__tests__/images/demo-product.jpg";
import demoFormattedImage from "./__tests__/images/demo-product-format.jpg";

<CardCheckboxGroup name="tileType2" defaultValue={["Zanda Arktis"]}>
  <CardCheckboxGroup.Item
    value="Zanda Arktis"
    title="Zanda Arktis"
    imageSource={demoFormattedImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
  <CardCheckboxGroup.Item
    value="Aerodek Traditional"
    title="Aerodek Traditional"
    imageSource={demoImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
</CardCheckboxGroup>;
```

### Show None

```jsx
import demoImage from "./__tests__/images/demo-product.jpg";
import demoFormattedImage from "./__tests__/images/demo-product-format.jpg";

<CardCheckboxGroup name="tileType3" noneLabel="None">
  <CardCheckboxGroup.Item
    value="Zanda Arktis"
    title="Zanda Arktis"
    imageSource={demoFormattedImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
  <CardCheckboxGroup.Item
    value="Aerodek Traditional"
    title="Aerodek Traditional"
    imageSource={demoImage}
  >
    <CardCheckboxGroup.Item.Paragraph>
      6 colours
    </CardCheckboxGroup.Item.Paragraph>
  </CardCheckboxGroup.Item>
</CardCheckboxGroup>;
```
