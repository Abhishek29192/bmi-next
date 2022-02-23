ContainerDialog component, based on Material UI Modal.

## Variants

### With Content

```jsx
import Button from "../button";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <ContainerDialog
    open={open}
    onCloseClick={() => setOpen(false)}
    backdropProps={{
      className: "test-backdrop"
    }}
  >
    {new Array(30).fill("Some content").map((content, i) => (
      <div key={i}>{content}</div>
    ))}
  </ContainerDialog>
</>;
```

### onBackdropClick

By default, it has the same value as `onCloseClick`.

```jsx
import Button from "../button";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <ContainerDialog
    open={open}
    onCloseClick={() => setOpen(false)}
    onBackdropClick={() => console.log("Backdrop clicked")}
  >
    <div>Some content</div>
  </ContainerDialog>
</>;
```
