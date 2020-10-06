The Vertical Roller is a carousel which slides vertically (if using a motion transition and not a fade) and includes action buttons that progress the roller to a specific slide. There is a single swipeable area that includes the image and accompanying text (shown below) which allows the user to increment or decrement the slide by swiping or click-dragging. Vertical Carousel Controls are also included in the module as well as the Roller Selector buttons which can also control the carousel. The carousel may contain between 2 and 6 items.

## Variants

### Default

```jsx
import Section from "@bmi/section";
import rooferGunImage from "./images/roofer-gun.png";
import houseImage from "./images/house.png";
import tilesBlack from "./images/demo-tiles-black.png";

const slides = [
  {
    title: "Approved Installers",
    imageSource: rooferGunImage,
    description:
      "Accredited BMI installers are masters of their craft and available all over Norway.",
    cta: {
      label: "Go to Approved Installers"
    }
  },
  {
    title: "Realiable Warranties",
    imageSource: houseImage,
    cta: {
      label: "Go to Realiable Warranties"
    }
  },
  {
    title: "Best tiles ever",
    imageSource: tilesBlack
  }
];

<Section backgroundColor="pearl" spacing="none">
  <VerticalRoller title="H2 Heading" slides={slides} />
</Section>;
```
