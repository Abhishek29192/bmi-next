This component wraps the [Material-UI Button component](https://material-ui.com/components/buttons/), with a few changes from the [BMI Styleguide](https://xd.adobe.com/view/e0abef5d-74f5-4a62-7afd-99db611cfdb9-969a/screen/e75f9708-4188-4b30-9d5d-ac8776e32729/Buttons-Components).

The Button is wrapped in a `Clickable` component and it accepts a `action?: ClickableAction`. See the Clickable specs for more info.

## Variants

### Contained

This, with `primary` colour, is the BMI default button

```tsx
<>
  <Button>Caption</Button>

  <p>Disabled</p>

  <Button disabled>Caption</Button>
</>
```

### Styled Button

```tsx
import ThemeProvider from "@bmi-digital/components/theme-provider";

const modifyTheme = (theme) => {
  theme.palette = theme.palette || {};
  theme.palette.primary = { main: "#201e5b", dark: "#161542" };

  return theme;
};

<ThemeProvider modifyTheme={modifyTheme}>
  <Button>Caption</Button>

  <p>Disabled</p>
  <Button disabled>Caption</Button>

  <p>On Dark background with color fallback</p>
  <div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
    <Button hasDarkBackground>Caption</Button>
  </div>
</ThemeProvider>;
```

#### Leading icon

```tsx
import UserIcon from "@material-ui/icons/Person";

<>
  <Button startIcon={<UserIcon />}>Sign in</Button>

  <p>Disabled</p>

  <Button startIcon={<UserIcon />} disabled>
    Sign in
  </Button>
</>;
```

#### Trailing icon

```jsx
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

<>
  <Button endIcon={<ArrowForwardIcon />}>Read more</Button>

  <p>Disabled</p>

  <Button endIcon={<ArrowForwardIcon />} disabled>
    Read more
  </Button>
</>;
```

### Outlined

```tsx
<>
  <Button variant="outlined">Caption</Button>

  <p>Disabled</p>

  <Button variant="outlined" disabled>
    Caption
  </Button>
</>
```

#### Leading icon

```tsx
import UserIcon from "@material-ui/icons/Person";

<>
  <Button startIcon={<UserIcon />} variant="outlined">
    Sign in
  </Button>

  <p>Disabled</p>

  <Button startIcon={<UserIcon />} variant="outlined" disabled>
    Sign in
  </Button>
</>;
```

#### Trailing icon

```jsx
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

<>
  <Button endIcon={<ArrowForwardIcon />} variant="outlined">
    Read more
  </Button>

  <p>Disabled</p>

  <Button endIcon={<ArrowForwardIcon />} variant="outlined" disabled>
    Read more
  </Button>
</>;
```

#### On Dark Background

```jsx
<div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
  <Button hasDarkBackground variant="outlined">
    Caption
  </Button>

  <p>Disabled</p>

  <Button hasDarkBackground variant="outlined" disabled>
    Caption
  </Button>
</div>
```

#### Opaque outlined

```jsx
<div style={{ padding: "10px", background: "#fafafa" }}>
  <Button variant="opaqueOutlined">Caption</Button>

  <p>Disabled</p>

  <Button variant="opaqueOutlined" disabled>
    Caption
  </Button>
</div>
```

### Flat

```jsx
<>
  <Button variant="text">Caption</Button>

  <p>Disabled</p>

  <Button variant="text" disabled>
    Caption
  </Button>
</>
```

#### On Dark Background

```jsx
<div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
  <Button hasDarkBackground variant="text">
    Caption
  </Button>

  <p>Disabled</p>

  <Button hasDarkBackground variant="text" disabled>
    Caption
  </Button>
</div>
```

### Icon Button

The `extra-small` and `small` buttons have a 48x48px clickable area around them.

```jsx
import UserIcon from "@material-ui/icons/Person";

<div>
  <p>Extra Small</p>
  <Button isIconButton size="extra-small">
    <UserIcon />
  </Button>
  <p>Small</p>
  <Button isIconButton size="small">
    <UserIcon />
  </Button>
  <p>Medium</p>
  <Button isIconButton size="medium">
    <UserIcon />
  </Button>
  <p>Large</p>
  <Button isIconButton size="large">
    <UserIcon />
  </Button>
  <p>Extra Large - disabled</p>
  <Button isIconButton disabled size="extra-large">
    <UserIcon />
  </Button>
</div>;
```
