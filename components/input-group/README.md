`InputGroup` wraps the `TextField` and the `Button` components together visually. You still need to wrap it within a `Form` and add functionality.

You can set a `lockBreakpoint` variable to set at what breakpoint the component should unlock. Set it to `false`, if you want to keep it locked up.

## Variants

### Outlined TextField

```jsx
import Button from "@bmi/button";
import TextField, { InputAdornment } from "@bmi/text-field";

<InputGroup
  input={<TextField label="First name" />}
  button={<Button>Submit</Button>}
/>;
```

### Hybrid TextField

```jsx
import Button from "@bmi/button";
import TextField, { InputAdornment } from "@bmi/text-field";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

<InputGroup
  input={<TextField variant="hybrid" label="Email address" />}
  button={<Button endIcon={<ArrowForwardIcon />}>Sign up</Button>}
/>;
```

### Icon Button

```jsx
import Button from "@bmi/button";
import TextField, { InputAdornment } from "@bmi/text-field";
import SearchIcon from "@material-ui/icons/Search";

<InputGroup
  input={<TextField label="Search" />}
  button={
    <Button accessibilityLabel="Search" isIconButton>
      <SearchIcon />
    </Button>
  }
/>;
```