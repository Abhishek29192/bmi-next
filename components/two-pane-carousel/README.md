The 2-pane Carousel consists of 2 separate areas (or "panes") - one contains the copy area and the other contains the image that relates to that copy. This means that each of these panes transitions independently of the other, much like how the Home Page Hero carousel works. So for example, swiping (or clicking and dragging) the copy pane left or right by 50% will transition the image pane by 50% and vice versa, even though their sizes may be different.

## Variants

```jsx
import Section from "@bmi/section";
import AnchorLink from "@bmi/anchor-link";
import Button from "@bmi/button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import demoHouseImage from "./images/demo-house.png";
import demoTilesBlack from "./images/demo-tiles-black.png";
import demoTiles from "./images/demo-tiles.jpg";
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";

const slides = [
  {
    title: "H1 Heading running onto 2 lines",
    brandIcon: AeroDek,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nisi, condimentum facilisis hendrerit eget, sollicitudin non sapien. Class aptent taciti sociosqu ad litora.",
    CTA: {
      label: "Read the full story"
    },
    imageSource: demoHouseImage
  },
  {
    title: "H1 Heading",
    children:
      "Aliquip velit exercitation sunt eiusmod. Ipsum est quis dolore cupidatat nisi reprehenderit aliquip exercitation. Magna mollit Lorem est aliqua consequat officia cillum dolor.",
    imageSource: demoTilesBlack
  },
  {
    title: "H1 Heading",
    children: "Aliquip velit exercitation sunt eiusmod.",
    CTA: {
      label: "Read the full story"
    },
    imageSource: demoTiles
  }
];

<Section backgroundColor="pearl" style={{ overflow: "hidden" }}>
  <TwoPaneCarousel slides={slides}>
    <Button endIcon={<ArrowForwardIcon />}>Call to action button</Button>
  </TwoPaneCarousel>
</Section>;
```
