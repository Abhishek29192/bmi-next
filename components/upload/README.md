The Upload component on desktop is a drag and drop area which sits within a single accordion item. On mobile it consists of an outlined upload button with a description

## Variants

```tsx
const uri = "https://run.mocky.io/v3/eb9e5061-31c2-4329-9e4a-3de6068ca6ac";

const mapBody = (file) => ({
  fields: {
    title: {
      "en-US": "Asset title"
    },
    description: {
      "en-US": "Asset description"
    },
    file: {
      "en-US": {
        contentType: file.type,
        fileName: file.name,
        file
      }
    }
  }
});

const mapValue = (_file, response) => response.sys.id;

<div>
  <p>Default</p>
  <div style={{ margin: "50px 0" }}>
    <Upload
      buttonLabel="Attach files"
      id="default-upload"
      uri={uri}
      headers={{
        "Content-Type": "application/octet-stream"
      }}
      mapBody={mapBody}
      mapValue={mapValue}
    />
  </div>

  <p>With upload URL</p>
  <div style={{ margin: "50px 0" }}>
    <Upload
      buttonLabel="Attach files"
      id="url-upload"
      uri={uri}
      headers={{
        "Content-Type": "application/octet-stream"
      }}
      mapBody={mapBody}
      mapValue={mapValue}
    />
  </div>

  <p>Accepting only images and PDFs</p>
  <div style={{ margin: "50px 0" }}>
    <Upload
      name="image-upload"
      buttonLabel="Choose files"
      accept=".png,.jpg,.pdf,.jpeg"
      id="image-upload"
      uri={uri}
      headers={{
        "Content-Type": "application/octet-stream"
      }}
      mapBody={mapBody}
      mapValue={mapValue}
    />
  </div>

  <p>With instructions</p>
  <div style={{ margin: "50px 0" }}>
    <Upload
      name="image-upload-with-instructions"
      buttonLabel="Attach files (optional)"
      instructions="Supported formats include: PDF, JPG, JPEG and PNG"
      accept=".png,.jpg,.pdf,.jpeg"
      id="upload-with-instructions"
      uri="https://run.mocky.io/v3/c5a04537-f12b-4fa4-82ea-71711db77ffb"
      headers={{
        "Content-Type": "application/octet-stream"
      }}
      mapBody={mapBody}
      mapValue={mapValue}
    />
  </div>
</div>;
```
