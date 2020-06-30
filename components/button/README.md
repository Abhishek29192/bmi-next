This component wraps the [Material-UI Button component](https://material-ui.com/components/buttons/), with a few changes from the [BMI Styleguide](https://xd.adobe.com/view/e0abef5d-74f5-4a62-7afd-99db611cfdb9-969a/screen/e75f9708-4188-4b30-9d5d-ac8776e32729/Buttons-Components)

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
