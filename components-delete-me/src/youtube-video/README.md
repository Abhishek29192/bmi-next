[description]

## Variants

### In place

```jsx
<div style={{ height: "400px" }}>
  <YoutubeVideo
    videoUrl="https://youtu.be/A-RfHC91Ewc"
    previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
    layout="in-place"
    embedWidth={1280}
    embedHeight={720}
  />
</div>
```

### Dialog

```jsx
<div style={{ height: "400px" }}>
  <YoutubeVideo
    videoUrl="https://youtu.be/A-RfHC91Ewc"
    previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
    embedWidth={1280}
    embedHeight={720}
  />
</div>
```

### Inline

```jsx
<YoutubeVideo
  videoUrl="https://youtu.be/A-RfHC91Ewc"
  previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
  layout="inline"
  embedWidth={1280}
  embedHeight={720}
  label="Promo video"
  subtitle="See how tile technology works Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate efficitur ex, eleifend lobortis nunc tincidunt ut. Morbi a ligula dictum lectus pulvinar malesuada. Duis aliquet lacus nisi, sit amet finibus quam ultrices eu. Aliquam erat volutpat. Cras pulvinar scelerisque hendrerit."
/>
```
