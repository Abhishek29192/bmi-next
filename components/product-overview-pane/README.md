## Variants

### [Title]

```jsx
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import blackImage from "./images/tile-black.jpg";
import brownImage from "./images/tile-brown.jpg";

const attributes = [
  {
    name: "Surface treatment",
    variants: [
      {
        label: "Gloss",
        isSelected: true
      }
    ]
  },
  {
    name: "Colour",
    type: "thumbnails",
    variants: [
      {
        label: "Black",
        isSelected: true,
        thumbnail: blackImage
      },
      {
        label: "Brown",
        thumbnail: brownImage,
        action: { model: "htmlLink", href: "#" }
      }
    ]
  },
  {
    name: "Size",
    variants: [
      {
        label: "22cm x 42cm",
        isSelected: true
      },
      {
        label: "12cm x 22cm",
        action: { model: "htmlLink", href: "#" }
      },
      {
        label: "30cm x 62cm"
      }
    ]
  }
];

<ProductOverviewPane
  name="Type S Roof Shingles"
  brandLogo={Zanda}
  nnob="1394983720195"
  attributes={attributes}
/>;
```
