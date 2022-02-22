## Variants

### Info

```jsx
import AnchorLink from "../anchor-link";

<AlertBanner severity="info">
  <AlertBanner.Title>Info</AlertBanner.Title>
  This is a info alert, <AnchorLink>see more info here</AnchorLink>
</AlertBanner>;
```

### Success

```jsx
<AlertBanner severity="success">
  <AlertBanner.Title>Success</AlertBanner.Title>
  This is a success alert
</AlertBanner>
```

### Warning

```jsx
import Button from "../button";
import CloseIcon from "@material-ui/icons/Close";

<AlertBanner
  severity="warning"
  actions={
    <Button isIconButton variant="text" accessibilityLabel={"Close"}>
      <CloseIcon />
    </Button>
  }
>
  <AlertBanner.Title>Warning</AlertBanner.Title>
  This is a warning alert
</AlertBanner>;
```

### Error

```jsx
<AlertBanner severity="error">
  <AlertBanner.Title>Error</AlertBanner.Title>
  This is an error alert
</AlertBanner>
```

### Sticky

```jsx
import Button from "../button";
import CloseIcon from "@material-ui/icons/Close";

<div style={{ height: "1000px" }}>
  <AlertBanner severity="warning" stickyPosition={0}>
    <AlertBanner.Title>Warning</AlertBanner.Title>
    This warning will stick at the top of the screen, on the specified position.
  </AlertBanner>
</div>;
```
