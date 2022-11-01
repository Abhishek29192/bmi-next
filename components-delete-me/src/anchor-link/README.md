A simple component to generate links with different formatting.

The `AnchorLink` is wrapped in a `Clickable` component and it accepts a `action?: ClickableAction`. See the Clickable specs for more info.

## Variants

### Default

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }}>BMI Group</AnchorLink>
```

### Disabled

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }} isDisabled>
  BMI Group
</AnchorLink>
```

### Leading Icon

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }} iconStart>
  BMI Group
</AnchorLink>
```

### Trailing Icon

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
  BMI Group
</AnchorLink>
```

### Icon Disabled

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd isDisabled>
  BMI Group
</AnchorLink>
```

### Within paragraph

Even when inside a paragraph, the minimum clickable height of the link is `42px`.

```tsx
import Typography from "../typography";

<Typography>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
  doloremque laudantium,{" "}
  <AnchorLink action={{ model: "htmlLink", href: "/" }}>
    totam rem aperiam
  </AnchorLink>
  , eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
  dicta sunt explicabo.
</Typography>;
```

### Multi-line With Icon

```tsx
<AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
  <p style={{ width: "300px", textAlign: "left" }}>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
  </p>
</AnchorLink>
```

### Different colours

The component has a `color` property to define a different colour from its default.

```tsx
<>
  <div style={{ backgroundColor: "#333" }}>
    <AnchorLink color="white">BMI Group</AnchorLink>
  </div>
  <AnchorLink color="black">BMI Group</AnchorLink>
</>
```

### Within a ColorPair component

The `AnchorLink` component uses the `ColorPair` context to understand the colour it should use (unless specified, see the example above).

```tsx
import ColorPair from "../color-pair";
import Typography from "../typography";

const colorBoxStyle = {
  width: "33%",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

<div style={{ display: "flex" }}>
  <ColorPair style={colorBoxStyle} theme="teal500">
    <Typography>
      This example shows a <AnchorLink>link on a</AnchorLink> teal 500 theme
    </Typography>
  </ColorPair>
  <ColorPair style={colorBoxStyle} theme="alert">
    <Typography>
      This example shows a <AnchorLink>link on a</AnchorLink> alert theme
    </Typography>
  </ColorPair>
  <ColorPair style={colorBoxStyle} theme="white">
    <Typography>
      This example shows a <AnchorLink>link on a</AnchorLink> white theme
    </Typography>
  </ColorPair>
</div>;
```
