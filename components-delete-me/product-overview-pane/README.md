The Product Overview Pane is similar to a large Card with no elevation. It contains an optional Brand logo, a H1 heading with the "smallest" class, a Drop Button and any number of Product Attribute Panels.

## Variants

### Default

```jsx
import { { Zanda } } from "@bmi-digital/components";
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
  nobb="1394983720195"
  nobbLabel="label"
  attributes={attributes}
/>;
```
