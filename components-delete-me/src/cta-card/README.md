A call to action card that houses title text, an image, and links to another page. Also has a lovely ripple effect.

## Variants

### Default

```jsx
import demoHouseImage from "./__tests__/images/demo-tiles.jpg";

<CTACard
  title="Call to Action Card"
  media={<img src={demoHouseImage} alt="Lorem ipsum" />}
/>;
```

### Clickable Area

By default, the full card is clickable area. If you want to override this (for example if something clickable is within the image area), you can add the property `clickableArea="heading"`.

```jsx
import demoHouseImage from "./__tests__/images/demo-tiles.jpg";

<CTACard
  title="Call to Action Card"
  clickableArea="heading"
  media={<img src={demoHouseImage} alt="Lorem ipsum" />}
/>;
```

### With deprecated `imageSource`

The property `imageSource` got deprecated. The correct implementation, as shown in the previous examples, is to use a React Node instead.

```jsx
import demoHouseImage from "./__tests__/images/demo-tiles.jpg";

<CTACard title="Call to Action Card" imageSource={demoHouseImage} />;
```
