This component is a list cards with an icon and text, that can be paginated with a "Show more" button

## Variants

### Default

```jsx
import UserIcon from "@material-ui/icons/Person";
import Typography from "@bmi-digital/components/typography";

const descriptions = [
  "Place, change or amend order",
  "Technical Queries",
  "Delivery information",
  "Problems with a product",
  "Product information",
  "Returns and replacements",
  "Guarantee information",
  "General queries"
];

const tiles = descriptions.map((description, index) => (
  <TileList.Item key={index} icon={UserIcon}>
    <Typography>{description}</Typography>
  </TileList.Item>
));

<TileList>{tiles}</TileList>;
```

### Paginated

```jsx
import UserIcon from "@material-ui/icons/Person";
import Typography from "@bmi-digital/components/typography";
import { Tile } from "./src";

const tiles = new Array(13).fill(
  <TileList.Item icon={UserIcon}>
    <Typography variant="h6">JOHN INGE WOLD</Typography>
    <Typography>Sales Manager</Typography>
    <Typography>Norway</Typography>
  </TileList.Item>
);

<TileList isPaginated itemsPerPage={4}>
  {tiles}
</TileList>;
```
