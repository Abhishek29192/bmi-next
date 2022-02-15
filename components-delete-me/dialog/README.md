Dialog component, based on Material UI Modal.

## Variants

### With Title, Content, and Actions

```jsx
import { Button } from "@bmi-digital/components";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <Dialog
    open={open}
    onCloseClick={() => setOpen(false)}
    backdropProps={{
      className: "test-backdrop"
    }}
  >
    <Dialog.Title hasUnderline>Heading (Optional)</Dialog.Title>
    <Dialog.Content>
      {new Array(30).fill("Some content").map((content, i) => (
        <div key={i}>{content}</div>
      ))}
    </Dialog.Content>
    <Dialog.Actions
      confirmLabel={"Close"}
      onConfirmClick={() => setOpen(false)}
    />
  </Dialog>
</>;
```

### With Two action buttons

```jsx
import { Button } from "@bmi-digital/components";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <Dialog open={open} onCloseClick={() => setOpen(false)}>
    <Dialog.Title hasUnderline>Heading (Optional)</Dialog.Title>
    <Dialog.Content>Some content</Dialog.Content>
    <Dialog.Actions
      cancelLabel={"Cancel"}
      onCancelClick={() => setOpen(false)}
      confirmLabel={"Ok"}
      onConfirmClick={() => setOpen(false)}
    />
  </Dialog>
</>;
```

### onBackdropClick

By default, it has the same value as `onCloseClick`.

```jsx
import { Button } from "@bmi-digital/components";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <Dialog
    open={open}
    onCloseClick={() => setOpen(false)}
    onBackdropClick={() => console.log("Backdrop clicked")}
  >
    <Dialog.Title hasUnderline>Heading (Optional)</Dialog.Title>
    <Dialog.Content>Some content</Dialog.Content>
    <Dialog.Actions
      confirmLabel={"Close"}
      onConfirmClick={() => setOpen(false)}
    />
  </Dialog>
</>;
```
