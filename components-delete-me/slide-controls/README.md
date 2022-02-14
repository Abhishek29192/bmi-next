Controls that can be used for the Carousel component.

## Variants

### Default

The `SlideControls` component accepts a `current` and a `total` number. When the properties change, it will slide to the next number using a sliding animation.

The component will add a "0" to the number to have at least two digits. The component for now does not handle more than 2 digit numbers.

```tsx
<SlideControls
  current={1}
  total={5}
  onPrevClick={() => console.log("Previous clicked!")}
  onNextClick={() => console.log("Next clicked!")}
/>
```

### Full size

By default, the `SlideControls` have a limited space, with `24px` margin between the numbers and the chevrons. If you want to use the full width of its parent, use the `isFullSize` property.

```tsx
<SlideControls isFullSize current={1} total={5} />
```

### Dark background

```tsx
<div style={{ padding: "10px", background: "#343850" }}>
  <SlideControls isDarkThemed current={1} total={5} />
</div>
```

### Vertical

The animation will be the same, but the elements will be displayed in a vertical order, including the chevrons.

```tsx
<SlideControls isVertical current={1} total={5} />
```

### How to control the component

This is an example of how the `SlideControls` can be used with external state.

```jsx
const total = 5;
const [current, setCurrent] = React.useState(1);

<SlideControls
  current={current}
  total={total}
  onPrevClick={() =>
    setCurrent((current) => {
      if (current - 1 === 0) {
        return total;
      }
      return current - 1;
    })
  }
  onNextClick={() =>
    setCurrent((current) => {
      if (current + 1 > total) {
        return 1;
      }
      return current + 1;
    })
  }
/>;
```

### Controlled

The `@bmi-digital/components/slide-controls` package also exports a version with internal state, `StateSlideControls`.

```tsx
import { StateSlideControls as SlideControls } from "@bmi-digital/components/slide-controls";

// Set this to true to see the vertical controlled.
const isVertical = false;

<SlideControls isVertical={isVertical} total={5} />;
```
