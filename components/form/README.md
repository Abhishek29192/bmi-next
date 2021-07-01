Utility component to manage form validation and styling.

The form submit button will be disabled if there are any validation errors. Therefore the form needs to be aware of all children's validation errors. This is achieved by passing a `updateFormState` function to the inputs using React Context.

## Variants

### No buttons

```tsx
<Form>
  <Form.Row>
    <input type="text" />
  </Form.Row>
</Form>
```

### Single button

```tsx
const onSubmit = (event, values) => {
  event.preventDefault();
  console.log("submit event", event, values);
};

<Form onSubmit={onSubmit}>
  <Form.Row>
    <input name="First Name" label="First Name" />
  </Form.Row>
  <Form.ButtonWrapper>
    <Form.SubmitButton>Send Message</Form.SubmitButton>
  </Form.ButtonWrapper>
</Form>;
```

### Multiple buttons

```tsx
const onSubmit = (event, values) => {
  event.preventDefault();
  console.log("submit event", event, values);
};

<Form onSubmit={onSubmit}>
  <Form.Row>
    <input name="First Name" label="First Name" />
  </Form.Row>
  <Form.ButtonWrapper>
    <Form.Button variant="outlined">Cancel</Form.Button>
    <Form.SubmitButton>Send Message</Form.SubmitButton>
  </Form.ButtonWrapper>
</Form>;
```

### Right align buttons

```tsx
const onSubmit = (event, values) => {
  event.preventDefault();
  console.log("submit event", event, values);
};

<Form onSubmit={onSubmit} rightAlignButton>
  <Form.Row>
    <input name="First Name" label="First Name" />
  </Form.Row>
  <Form.ButtonWrapper>
    <Form.Button variant="outlined">Cancel</Form.Button>
    <Form.SubmitButton>Send Message</Form.SubmitButton>
  </Form.ButtonWrapper>
</Form>;
```
