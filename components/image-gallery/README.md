The Image Gallery is a simple module consisting of a large image and a collection of Image Thumbnail Buttons. Tapping or clicking an Image Thumbnail Button will replace the large image.

## Variants

### Default

```jsx
import firstImageSource from "./images/demo-tiles.jpg";
import secondImageSource from "./images/demo-tiles-black.png";
import thirdImageSource from "./images/demo-house.png";

const images = [
  {
    mainSource: firstImageSource,
    altText: "Demo Tiles"
  },
  {
    mainSource: secondImageSource,
    altText: "Demo Tiles Black"
  },
  {
    mainSource: thirdImageSource,
    altText: "Demo house"
  }
];

<ImageGallery images={images} />;
```

### Overflowing Thumbnails

When the number of thumbnails in the row overflows the container, they become horizontally scrollable instead of wrapping onto multiple rows.

On tablet or mobile devices (touch-driven systems), the thumbnail group is scrollable by swiping. Overflowing content is indicated with the addition of overlay gradients.
Check on your phone or simulate a touch device to demo.

```jsx
import firstImageSource from "./images/demo-tiles.jpg";
import secondImageSource from "./images/demo-tiles-black.png";
import thirdImageSource from "./images/demo-house.png";

const images = [
  {
    mainSource: firstImageSource,
    altText: "Demo Tiles"
  },
  {
    mainSource: secondImageSource,
    altText: "Demo Tiles Black"
  },
  {
    mainSource: thirdImageSource,
    altText: "Demo house"
  }
];

<ImageGallery
  images={[
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
    ...images
  ]}
/>;
```

### Only one image

When only one image gets passed, no thumbnail will be rendered.

```jsx
import firstImageSource from "./images/demo-tiles.jpg";

<ImageGallery
  images={[
    {
      mainSource: firstImageSource,
      altText: "Demo Tiles"
    }
  ]}
/>;
```

### with image covering all canvas

```jsx
import firstImageSource from "./images/demo-tiles.jpg";
import secondImageSource from "./images/demo-tiles-black.png";
import thirdImageSource from "./images/demo-house.png";

const images = [
  {
    mainSource: firstImageSource,
    altText: "Demo Tiles"
  },
  {
    mainSource: secondImageSource,
    altText: "Demo Tiles Black"
  },
  {
    mainSource: thirdImageSource,
    altText: "Demo house"
  }
];

<ImageGallery images={images} imageSize="cover" />;
```
