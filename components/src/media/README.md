Utility component to render a media node (`img` tags and Youtube video are accepted for now).

## Variants

### Default

```jsx
import imageSource from "./__tests__/images/demo-tiles.jpg";

<div
  style={{
    height: 300
  }}
>
  <Media>
    <img src={imageSource} alt="Lorem ipsum" />
  </Media>
</div>;
```

### With Video

```jsx
import YoutubeVideo from "../youtube-video";

<div
  style={{
    height: 300
  }}
>
  <Media>
    <YoutubeVideo
      videoUrl="https://youtu.be/A-RfHC91Ewc"
      previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
      embedWidth={1280}
      embedHeight={720}
    />
  </Media>
</div>;
```
