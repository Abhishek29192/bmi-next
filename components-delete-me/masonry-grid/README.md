A component to provide a masonry grid layout.

## Variants

### Default

```jsx
import { Button } from "@bmi-digital/components";
import { ExpandableLinksTextCard } from "@bmi-digital/components";
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

<MasonryGrid>
  <ExpandableLinksTextCard
    title="Column One"
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
  />
  <ExpandableLinksTextCard
    title="Column Two"
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
  />
  <ExpandableLinksTextCard
    title="Column Three"
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
  />
  <ExpandableLinksTextCard
    title="Column Four"
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
  />
  <ExpandableLinksTextCard
    title="Column Five"
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
  />
</MasonryGrid>;
```
