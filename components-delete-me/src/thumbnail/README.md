Thumbnail Buttons are tappable rectangular components which consist of either a colour swatch or an image. They have a "selected" state and work in groups that behave like radio buttons - i.e. only one button in any group may be "selected" at one time.

## Variants

### Colour swatch

The Thumbnail component accepts a `color` property.

```jsx
<>
  <p>Enabled</p>
  <Thumbnail altText="Blue" color="#33b2e9" /> <Thumbnail
    altText="Blue"
    color="#33b2e9"
    size="large"
  />
  <p>Selected</p>
  <Thumbnail altText="Blue" color="#33b2e9" state="selected" /> <Thumbnail
    altText="Blue"
    color="#33b2e9"
    state="selected"
    size="large"
  />
  <p>Disabled</p>
  <Thumbnail altText="Blue" color="#33b2e9" state="disabled" /> <Thumbnail altText="Blue" color="#33b2e9" state="disabled" size="large" />
</>
```

### Image

```jsx
import blackTile from "./__tests__/images/tile-black.jpg";
import brownTile from "./__tests__/images/tile-brown.jpg";

<>
  <p>Enabled</p>
  <Thumbnail altText="Black" color="#fff" imageSource={blackTile} /> <Thumbnail
    altText="Brown"
    imageSource={brownTile}
    size="large"
  />
  <p>Selected</p>
  <Thumbnail
    altText="Black"
    color="#fff"
    state="selected"
    imageSource={blackTile}
  /> <Thumbnail
    altText="Brown"
    imageSource={brownTile}
    state="selected"
    size="large"
  />
  <p>Disabled</p>
  <Thumbnail
    altText="Black"
    color="#fff"
    imageSource={blackTile}
    state="disabled"
  /> <Thumbnail altText="Brown" imageSource={brownTile} state="disabled" size="large" />
</>;
```
