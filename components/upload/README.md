The Upload component consists of an outlined upload button with a description

## Variants

### Default

```jsx
<Upload buttonLabel="Upload" id="default-upload" />
```

### Accepting only images

```jsx
<Upload
  name="image-upload"
  buttonLabel="Choose files"
  accept="image/*"
  id="image-upload"
/>
```

### With description

```jsx
<Upload
  name="image-upload"
  buttonLabel="Choose files"
  accept="image/*"
  instructions="Supported formats include: PDF, JPG, JPEG and PNG"
  id="upload-with-instructions"
/>
```
