This component is wrapping the Material-UI [TextField component](https://material-ui.com/components/text-fields), with an additional Hybrid variant.

## Variants

### Outlined

```tsx
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ErrorRounded from "@material-ui/icons/ErrorRounded";
import Form from "@bmi/form";

<Form>
  <Form.Row>
    <p>Enabled</p>
    <TextField
      label="email"
      variant="outlined"
      placeholder="e.g. lorem@ipsum.com"
      helperText="Enabled hint text"
    />
  </Form.Row>
  <Form.Row>
    <p>Disabled</p>
    <TextField
      label="email"
      variant="outlined"
      placeholder="e.g. lorem@ipsum.com"
      disabled
      helperText="Disabled hint text"
    />
  </Form.Row>
  <Form.Row>
    <p>Errored</p>
    <TextField
      label="email"
      variant="outlined"
      placeholder="e.g. lorem@ipsum.com"
      error
      helperText="Incorrect email"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ErrorRounded style={{ color: "red" }} />
          </InputAdornment>
        )
      }}
    />
  </Form.Row>
  <Form.Row>
    <TextField
      label="nickname"
      variant="outlined"
      helperText="Icon hint text"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        )
      }}
    />
  </Form.Row>
  <Form.Row>
    <TextField
      isTextArea
      label="nickname"
      variant="outlined"
      helperText="Textarea"
    />
  </Form.Row>
  <Form.Row>
    <TextField
      isTextArea
      label="nickname"
      variant="outlined"
      helperText="Textarea with max 3 rows"
      rowsMax={3}
    />
  </Form.Row>
  <Form.Row>
    <TextField
      fullWidth
      label="nickname"
      variant="outlined"
      helperText="Full width field"
    />
  </Form.Row>
</Form>;
```

### Hybrid

This is an addition to MaterialUI. The rational behind this is to use the same style of the Outlined TextField, with a non-white background.

```tsx
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ErrorRounded from "@material-ui/icons/ErrorRounded";
import Form from "@bmi/form";

<div style={{ background: "#eee", padding: "10px" }}>
  <Form>
    <Form.Row>
      <p>Enabled</p>
      <TextField
        label="email"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        helperText="Enabled hint text"
      />
    </Form.Row>
    <Form.Row>
      <p>Disabled</p>
      <TextField
        label="email"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        disabled
        helperText="Disabled hint text"
      />
    </Form.Row>
    <Form.Row>
      <p>Errored</p>
      <TextField
        label="email"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        error
        helperText="Incorret email"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ErrorRounded style={{ color: "red" }} />
            </InputAdornment>
          )
        }}
      />
    </Form.Row>
    <Form.Row>
      <TextField
        label="nickname"
        variant="hybrid"
        helperText="Icon hint text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          )
        }}
      />
    </Form.Row>
    <Form.Row>
      <TextField
        isTextArea
        label="nickname"
        variant="hybrid"
        helperText="Textarea"
        rows={7}
      />
    </Form.Row>
    <Form.Row>
      <TextField
        fullWidth
        label="nickname"
        variant="hybrid"
        helperText="Full width field"
      />
    </Form.Row>
  </Form>
</div>;
```

_To see more variants, check [BMI styleguide](https://xd.adobe.com/view/e0abef5d-74f5-4a62-7afd-99db611cfdb9-969a/screen/fd41c705-1170-4c1b-bea8-62e47d5e6dc1/Text-Fields-Components)._
