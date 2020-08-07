Utility component to manage form validation and styling.

The form submit button will be disabled if there are any validation errors. Therefore the form needs to be aware of all children's validation errors. This is achieved by passing a `updateFormState` function to the inputs using React Context.

## Variants

```tsx
<Form>
  <Form.Row>
    <input type="text" />
  </Form.Row>
</Form>
```

## Contact Us Example

```tsx
import TextField from "@bmi/text-field";
import Grid from "@bmi/grid";
import Upload from "@bmi/upload";
import Checkbox from "@bmi/checkbox";

const onSubmit = (event, values) => {
  event.preventDefault();
  console.log("submit event", event, values);
};

<Form onSubmit={onSubmit} submitButtonLabel="Send Message" rightAlignButton>
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="First Name"
          isRequired
          variant="outlined"
          label="First Name"
          fullWidth
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="Last Name"
          isRequired
          label="Last Name"
          variant="outlined"
          fullWidth
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="Email"
          isRequired
          variant="outlined"
          label="Email"
          fullWidth
          getValidationError={(val) => {
            if (val.includes("@")) {
              return false;
            } else {
              return "Your email address doesn't have an '@'";
            }
          }}
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="Company name"
          label="Company name (if applicable)"
          variant="outlined"
          fullWidth
          helperText="(Optional)"
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="Telephone"
          variant="outlined"
          label="Telephone"
          fullWidth
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12} md={6}>
      <Form.Row>
        <TextField
          name="Type of query"
          label="Type of query"
          variant="outlined"
          fullWidth
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <Upload
          id="file-upload"
          name="Upload"
          buttonLabel="Choose files"
          accept="image/*"
          instructions="Supported formats include: PDF, JPG, JPEG and PNG"
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <TextField
          isTextArea
          name="Your message"
          label="Your message"
          variant="outlined"
          fullWidth
          rows={6}
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <Checkbox
          name="Copy checkbox"
          label="Send a copy of this message to my email address"
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <Checkbox
          name="Newsletter checkbox"
          label="Sign up for the BMI newsletter"
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <Checkbox
          name="Data protection checkbox"
          label="I agree with BMI's Data Protection Policy"
        />
      </Form.Row>
    </Grid>
    <Grid item xs={12}>
      <Form.Row>
        <Checkbox
          name="Information collection checkbox"
          label="I accept that my information may be processed and used solely for the submission of information and advertising about products, services and other activities. I have the right to revoke this agreement in writing at any time."
        />
      </Form.Row>
    </Grid>
  </Grid>
</Form>;
```
