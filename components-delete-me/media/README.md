Utility component to render a media node (`img` tags and Youtube video are accepted for now).

## Variants

### Default

```jsx
import imageSource from "./images/demo-tiles.jpg";

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
import { YoutubeVideo } from "@bmi-digital/components";

<div
  style={{
    height: 300
  }}
>
  <Media>
    <YoutubeVideo videoId="A-RfHC91Ewc" embedWidth={1280} embedHeight={720} />
  </Media>
</div>;
```
