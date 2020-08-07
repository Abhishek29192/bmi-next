This component wraps the Material UI [Select](https://material-ui.com/api/select/) component and contains a [FormControl](https://material-ui.com/api/form-control/) wrapper

## Variants

### Outlined

#### Default

```jsx
import { MenuItem } from "./src";

<Select label="Country" labelId="outlined-country-simple">
  <MenuItem aria-label="None" value="">
    None
  </MenuItem>
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Error

```jsx
import { MenuItem } from "./src";

<Select error label="Country" labelId="outlined-country-errored">
  <MenuItem aria-label="None" value="">
    None
  </MenuItem>
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Disabled

```jsx
import { MenuItem } from "./src";

<Select disabled label="Country" labelId="outlined-country-disabled">
  <MenuItem aria-label="None" value="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

### Hybrid

#### Default

```jsx
import { MenuItem } from "./src";

<Select variant="hybrid" label="Country" labelId="hybrid-country-simple">
  <MenuItem aria-label="None" value="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Error

```jsx
import { MenuItem } from "./src";

<Select error variant="hybrid" label="Country" labelId="hybrid-country-errored">
  <MenuItem aria-label="None" value="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Disabled

```jsx
import { MenuItem } from "./src";

<Select
  disabled
  variant="hybrid"
  label="Country"
  labelId="hybrid-country-disabled"
>
  <MenuItem aria-label="None" value="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```
