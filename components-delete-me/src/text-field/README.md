This component is wrapping the Material-UI [TextField component](https://material-ui.com/components/text-fields), with an additional Hybrid variant.

If a validation error occurs, it will be shown in red instead of the helper text. This is only displayed after the field is blurred or the form is submitted.

## Variants

### Outlined

```tsx
import AccountCircle from "@material-ui/icons/AccountCircle";
import Form from "../form";

<Form>
  <Form.Row>
    <p>Enabled</p>
    <TextField
      id="email"
      name="Email"
      label="Email address"
      variant="outlined"
      placeholder="e.g. lorem@ipsum.com"
      helperText="Enabled hint text"
    />
  </Form.Row>
  <Form.Row>
    <p>Disabled</p>
    <TextField
      id="email"
      name="Email"
      label="Email address"
      variant="outlined"
      placeholder="e.g. lorem@ipsum.com"
      disabled
      helperText="Disabled hint text"
    />
  </Form.Row>
  <Form.Row>
    <p>Left Adornment</p>
    <TextField
      id="email"
      name="Email"
      label="Email address"
      variant="outlined"
      helperText="Icon hint text"
      leftAdornment={<AccountCircle />}
    />
  </Form.Row>
  <Form.Row>
    <p>Right Adornment</p>
    <TextField
      id="email"
      name="Email"
      label="Email address"
      variant="outlined"
      helperText="Icon hint text"
      rightAdornment={<AccountCircle />}
    />
  </Form.Row>
  <Form.Row>
    <p>TextArea</p>
    <TextField
      isTextArea
      id="nickname"
      name="Nickname"
      label="nickname"
      variant="outlined"
      helperText="Hint Text"
    />
  </Form.Row>
  <Form.Row>
    <p>TextArea with max 3 rows</p>
    <TextField
      isTextArea
      id="nickname"
      name="Nickname"
      label="nickname"
      variant="outlined"
      helperText="Hint Text"
      rowsMax={3}
    />
  </Form.Row>
  <Form.Row>
    <p>Full width field</p>
    <TextField
      fullWidth
      id="nickname"
      name="Nickname"
      label="nickname"
      variant="outlined"
      helperText="Hint Text"
    />
  </Form.Row>
</Form>;
```

### Hybrid

This is an addition to MaterialUI. The rational behind this is to use the same style of the Outlined TextField, with a non-white background.

```tsx
import AccountCircle from "@material-ui/icons/AccountCircle";
import Form from "../form";

<div style={{ background: "#eee", padding: "10px" }}>
  <Form>
    <Form.Row>
      <p>Enabled</p>
      <TextField
        id="email"
        name="Email"
        label="Email address"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        helperText="Enabled hint text"
      />
    </Form.Row>
    <Form.Row>
      <p>Disabled</p>
      <TextField
        id="email"
        name="Email"
        label="Email address"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        disabled
        helperText="Disabled hint text"
      />
    </Form.Row>
    <Form.Row>
      <TextField
        id="nickname"
        name="Nickname"
        label="nickname"
        variant="hybrid"
        helperText="Icon hint text"
        leftAdornment={<AccountCircle />}
      />
    </Form.Row>
    <Form.Row>
      <TextField
        isTextArea
        id="nickname"
        name="Nickname"
        label="nickname"
        variant="hybrid"
        helperText="Textarea"
        rows={7}
      />
    </Form.Row>
    <Form.Row>
      <TextField
        fullWidth
        id="nickname"
        name="Nickname"
        label="nickname"
        variant="hybrid"
        helperText="Full width field"
      />
    </Form.Row>
  </Form>
</div>;
```

_To see more variants, check [BMI styleguide](https://xd.adobe.com/view/e0abef5d-74f5-4a62-7afd-99db611cfdb9-969a/screen/fd41c705-1170-4c1b-bea8-62e47d5e6dc1/Text-Fields-Components)._
