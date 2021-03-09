The Visualiser is a dialog containing the visualiser library.

## Variants

### Default

```jsx
import Button from "@bmi/button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { tilesSetData, sidingsSetData } from "./src/";

const [open, setOpen] = React.useState(false);
<>
  <Button
    variant="outlined"
    startIcon={<ArrowForwardIcon />}
    onClick={() => setOpen(true)}
  >
    Open Visualiser
  </Button>

  <Visualiser
    open={open}
    contentSource="https://storage.googleapis.com/bmi-dxb-webtools-storage-dev"
    tiles={tilesSetData}
    sidings={sidingsSetData}
    onClose={() => setOpen(false)}
  />
</>;
```
