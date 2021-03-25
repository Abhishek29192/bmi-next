A call to action card that houses title text, an image, and links to another page. Also has a lovely ripple effect.

## Variants

### Default

```jsx
import demoHouseImage from "./images/demo-tiles.jpg";

<CTACard title="Call to Action Card" imageSource={demoHouseImage} />;
```

### CTA Card with react component as imageSource

```jsx
<CTACard
  title="Call to Action Card"
  imageSource={
    <div style={{ height: "100px", width: "100%" }}>my component</div>
  }
/>
```
