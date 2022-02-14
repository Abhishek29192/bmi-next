This package exports the Material-UI [grid component](https://material-ui.com/components/grid/)

## Centered layout

When `justify` is set to center, then it'll follow the rules dictated by the DS.

```jsx
import { useState } from "react";
import Typography from "@bmi-digital/components/typography";

const [rows, setRows] = useState(5);

const text = `
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.`;

const card = () => (
  <div style={{ background: "white", border: "1px solid #ccc" }}>
    {text.substring(0, Math.floor(Math.random() * 180))}
  </div>
);

<div>
  <div style={{ padding: "30px" }}>
    <button
      onClick={() => {
        setRows((i) => i + 1);
      }}
    >
      add item
    </button>{" "}
    <button
      onClick={() => {
        setRows((i) => i - 1);
      }}
    >
      remove item
    </button>{" "}
    items: {rows}
  </div>

  <Grid container spacing={3} justify="center">
    {Array.from({ length: rows }).map((_, index) => (
      <Grid item xs={12} md={6} xl={3}>
        {card()}
      </Grid>
    ))}
  </Grid>
</div>;
```
