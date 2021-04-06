A call to action card that houses title text, an image, and links to another page. Also has a lovely ripple effect.

## Variants

### Default

```jsx
import demoHouseImage from "./images/demo-tiles.jpg";

<CTACard
  title="Call to Action Card"
  media={<img src={demoHouseImage} alt="Lorem ipsum" />}
/>;
```

### With deprecated `imageSource`

The property `imageSource` got deprecated. The correct implementation, as shown in the previous examples, is to use a React Node instead.

```jsx
import demoHouseImage from "./images/demo-tiles.jpg";

<CTACard title="Call to Action Card" imageSource={demoHouseImage} />;
```
