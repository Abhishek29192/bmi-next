The RawTextField effectively implements the [TextField](http://192.168.1.6:6060/#/TextField), but without a formControl wrapper.

It is needed for the [UpDownSimpleNumericInput](http://localhost:6060/#/UpDownSimpleNumericInput) component.

## Variants

### Outlined

```tsx
import AccountCircle from "@material-ui/icons/AccountCircle";
import Form from "@bmi/form";

<Form>
  <Form.Row>
    <p>Enabled</p>
    <RawTextField
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
    <RawTextField
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
    <RawTextField
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
    <RawTextField
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
    <RawTextField
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
    <RawTextField
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
    <RawTextField
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
