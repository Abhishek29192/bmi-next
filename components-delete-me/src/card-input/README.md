A simple component for selecting a card in a collection of [ToggleCards](http://localhost:6060/#/ToggleCard).

Typically used within a [CardRadioGroup](http://localhost:6060/#/CardRadioGroup).

## Variants

### Default (Radio)

```jsx
import demoImage from "./__tests__/images/demo-product.jpg";
import demoFormattedImage from "./__tests__/images/demo-product-format.jpg";

<CardInput
  name="tileType"
  value="Aerodek Classic"
  title="Aerodek Classic"
  imageSource={demoImage}
>
  <CardInput.Paragraph>6 colours </CardInput.Paragraph>
</CardInput>;
```

### Checkbox

```jsx
import demoImage from "./__tests__/images/demo-product.jpg";
import demoFormattedImage from "./__tests__/images/demo-product-format.jpg";

<CardInput
  type="checkbox"
  name="tileType"
  value="Aerodek Classic"
  title="Aerodek Classic"
  imageSource={demoImage}
>
  <CardInput.Paragraph>6 colours </CardInput.Paragraph>
</CardInput>;
```
