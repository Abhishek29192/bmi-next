Component that can be used to add contextual title and description to an input action.
Since the whole component is considerable as an input, you'll still need to wrap it in a Form and handle the submission.

## Variants

### Newsletter

At the moment, this is the only case where the `InputBanner` has been used.

```jsx
<InputBanner
  title="Sign up for our newsletter"
  description="Get the very latest roofing news, tips, product information and innovations directly from BMI straight to your inbox."
  inputLabel="Email address"
  inputCallToAction="Sign up"
  onSubmit={console.log}
/>
```

### With confirmation dialog

You can use the Dialog component to create some confirmation logic around the `InputBanner`.

```jsx
import Dialog from "@bmi-digital/components/dialog";

const [email, setEmail] = React.useState("");
const [dialogOpen, setDialogOpen] = React.useState(false);
const [secondDialogOpen, setSecondDialogOpen] = React.useState(false);

<>
  <Dialog open={dialogOpen} onCloseClick={() => setDialogOpen(false)}>
    <Dialog.Title hasUnderline>Sign up for our newsletter</Dialog.Title>
    <Dialog.Content>Some content</Dialog.Content>
    <Dialog.Actions
      cancelLabel={"Cancel"}
      onCancelClick={() => setDialogOpen(false)}
      confirmLabel={"Ok"}
      onConfirmClick={() => {
        setDialogOpen(false);
        setSecondDialogOpen(true);
      }}
    />
  </Dialog>
  <Dialog
    open={secondDialogOpen}
    onCloseClick={() => setSecondDialogOpen(false)}
  >
    <Dialog.Title hasUnderline>Thank you for signing up</Dialog.Title>
    <Dialog.Content>
      We have successfully added your email address to our mailing list. We'll
      send you a confirmation shortly.
    </Dialog.Content>
    <Dialog.Actions
      confirmLabel={"Ok"}
      onConfirmClick={() => setSecondDialogOpen(false)}
    />
  </Dialog>

  <InputBanner
    title="Sign up for our newsletter"
    description="Get the very latest roofing news, tips, product information and innovations directly from BMI straight to your inbox."
    inputLabel="Email address"
    inputCallToAction="Sign up"
    onSubmit={(email) => {
      setEmail(email);
      setDialogOpen(true);
    }}
  />
</>;
```
