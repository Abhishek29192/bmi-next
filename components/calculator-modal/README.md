The CalculatorModal component is based on the Dialog component, which in turn is based on Material UI Modal.
Its dimensions and header properties are suited for use in a Calculator tool.

## Variants

### Default

```jsx
import Button from "@bmi/button";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <CalculatorModal
    open={open}
    onCloseClick={() => setOpen(false)}
    headerCentre="Some rather lengthy, extremely verbose, Central Content in the header"
    backdropProps={{
      className: "test-backdrop"
    }}
  >
    {new Array(30).fill("Some content").map((content, i) => (
      <div key={i}>{content}</div>
    ))}
  </CalculatorModal>
</>;
```

### Pearl background

```jsx
import Button from "@bmi/button";
const [open, setOpen] = React.useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <CalculatorModal
    open={open}
    pearl
    onCloseClick={() => setOpen(false)}
    headerCentre="Some rather lengthy, extremely verbose, Central Content in the header"
    backdropProps={{
      className: "test-backdrop"
    }}
  >
    {new Array(30).fill("Some content").map((content, i) => (
      <div key={i}>{content}</div>
    ))}
  </CalculatorModal>
</>;
```
