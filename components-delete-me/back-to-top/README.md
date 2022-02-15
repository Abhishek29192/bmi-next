This button can be placed on any page. It will appear as soon as the user scrolls more than two viewport heights and clicking it will scroll back to the top.

```tsx
import { Typography } from "@bmi-digital/components";

<>
  <BackToTop accessibilityLabel="back-to-top" />
  <Typography>Scroll down</Typography>
  {new Array(300).fill(<Typography>.</Typography>)}
</>;
```
