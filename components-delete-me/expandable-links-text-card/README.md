A component for displaying a title with links.

## Variants

### Default

```jsx
import { Button } from "@bmi-digital/components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const links = [
  { label: "Link 1", action: {} },
  { label: "Link 2", action: {} },
  { label: "Link 3", action: {} },
  { label: "Link 4", action: {} },
  { label: "Link 5", action: {} },
  { label: "Link 6", action: {} }
];

<ExpandableLinksTextCard
  title="Link Column Title"
  links={links}
  openButton={
    <Button
      variant="outlined"
      endIcon={<AddIcon />}
      style={{ marginTop: "24px" }}
    >
      View more
    </Button>
  }
  closeButton={
    <Button
      variant="outlined"
      endIcon={<RemoveIcon />}
      style={{ marginTop: "24px" }}
    >
      View less
    </Button>
  }
/>;
```

### Link count than separator

```jsx
import { Button } from "@bmi-digital/components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const links = [
  { label: "Link 1", action: {} },
  { label: "Link 2", action: {} },
  { label: "Link 3", action: {} }
];

<ExpandableLinksTextCard
  title="Link Column Title"
  links={links}
  openButton={
    <Button
      variant="outlined"
      endIcon={<AddIcon />}
      style={{ marginTop: "24px" }}
    >
      View more
    </Button>
  }
  closeButton={
    <Button
      variant="outlined"
      endIcon={<RemoveIcon />}
      style={{ marginTop: "24px" }}
    >
      View less
    </Button>
  }
/>;
```
