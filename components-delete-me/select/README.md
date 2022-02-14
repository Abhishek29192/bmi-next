This component wraps the Material UI [Select](https://material-ui.com/api/select/) component and contains a [FormControl](https://material-ui.com/api/form-control/) wrapper

## Variants

### Outlined

#### Default

```jsx
import { MenuItem } from "./src";

<Select name="country" label="Country" labelId="outlined-country-simple">
  <MenuItem aria-label="None" defaultValue="">
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

<Select name="country" error label="Country" labelId="outlined-country-errored">
  <MenuItem aria-label="None" defaultValue="">
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

<Select
  name="country"
  disabled
  label="Country"
  labelId="outlined-country-disabled"
>
  <MenuItem aria-label="None" defaultValue="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

### Hybrid

#### Default

```jsx
import { MenuItem } from "./src";

<Select
  name="country"
  variant="hybrid"
  label="Country"
  labelId="hybrid-country-simple"
>
  <MenuItem aria-label="None" defaultValue="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Error

```jsx
import { MenuItem } from "./src";

<Select
  name="country"
  error
  variant="hybrid"
  label="Country"
  labelId="hybrid-country-errored"
>
  <MenuItem aria-label="None" defaultValue="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```

#### Disabled

```jsx
import { MenuItem } from "./src";

<Select
  name="country"
  disabled
  variant="hybrid"
  label="Country"
  labelId="hybrid-country-disabled"
>
  <MenuItem aria-label="None" defaultValue="" />
  <MenuItem value="uk">United Kingdom</MenuItem>
  <MenuItem value="no">Norway</MenuItem>
  <MenuItem value="fr">France</MenuItem>
</Select>;
```
