This component manages the pairing of possible background/font colours, in respect of the accessibility constraints.

## Variants

### Default

You can use the `ColorPair` with any of the themes that you can find in the Props.

```jsx
import { availableThemes } from "../color-pair";

const colorBoxStyle = {
  width: "25%",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

<div style={{ display: "flex", flexWrap: "wrap" }}>
  {availableThemes.map((theme, key) => (
    <ColorPair theme={theme} style={colorBoxStyle} key={key}>
      {theme}
    </ColorPair>
  ))}
</div>;
```

### Custom component

You can pass a `markupComponent` that accepts any `ElementType`.

```jsx
<ColorPair markupComponent="span" theme="magenta-400">
  I'm inside a span
</ColorPair>
```

### `withColorPair`

This component also exports a utility function to wrap any `ComponentType` with a ColorPair functionality.

```tsx
import { withColorPair } from "../color-pair";

const Section = ({ children, ...rest }) => (
  <div style={{ padding: "40px" }} {...rest}>
    {children}
  </div>
);
const SectionWithColorPair = withColorPair(Section);

<SectionWithColorPair theme="purple-400">
  Section with ColorPair!
</SectionWithColorPair>;
```
