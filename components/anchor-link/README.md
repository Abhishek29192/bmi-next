A simple component to generate links with different formatting.

## Variants

### Default

```tsx
<AnchorLink href="/" to="/">
  BMI Group
</AnchorLink>
```

### Disabled

```tsx
<AnchorLink href="/" to="/" isDisabled>
  BMI Group
</AnchorLink>
```

### Leading Icon

```tsx
<AnchorLink href="/" to="/" iconStart>
  BMI Group
</AnchorLink>
```

### Trailing Icon

```tsx
<AnchorLink href="/" to="/" iconEnd>
  BMI Group
</AnchorLink>
```

### Icon Disabled

```tsx
<AnchorLink href="/" to="/" iconEnd isDisabled>
  BMI Group
</AnchorLink>
```

### Within paragraph

Even when inside a paragraph, the minimum clickable height of the link is `42px`.

```tsx
import Typography from "@bmi/typography";

<Typography>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
  doloremque laudantium,{" "}
  <AnchorLink href="/" to="/">
    totam rem aperiam
  </AnchorLink>
  , eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
  dicta sunt explicabo.
</Typography>;
```

### Multi-line With Icon

```tsx
<AnchorLink href="/" to="/" iconEnd>
  <p style={{ width: "300px", textAlign: "left" }}>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
  </p>
</AnchorLink>
```
