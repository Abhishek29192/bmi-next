The Carousel component wraps and enhances the `react-swipeable-views` npm module.

## Variants

There are several carousel variants in the DXB styleguide and they all have this as a base.

### Stateful

Wrap as many slides as you want using the `Carousel.Slide` as direct children of a `Carousel` element and in a sequence.
Then place the `Carousel.Controls` before or after the slides, wrapped in any element.

The `slidesPerPage` property will set how many slides will be visible in every page.
It can be a number or a Breakpoint object. Check the Arrow Controls example for more information.

```jsx
const Slide = ({ children, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
      height: "300px"
    }}
  >
    {children}
  </div>
);

<Carousel>
  <div
    style={{
      paddingBottom: "10px",
      marginBottom: "10px",
      borderBottom: "2px dashed #CCC",
      display: "flex",
      justifyContent: "center"
    }}
  >
    <Carousel.Controls />
  </div>
  <Carousel.Slide>
    <Slide color="#73c6b6">First slide</Slide>
  </Carousel.Slide>
  <Carousel.Slide>
    <Slide color="#7389c6">Second slide</Slide>
  </Carousel.Slide>
  <Carousel.Slide>
    <Slide color="#652ca3">Third slide</Slide>
  </Carousel.Slide>
  <div
    style={{
      paddingTop: "10px",
      marginTop: "10px",
      borderTop: "2px dashed #CCC",
      display: "flex",
      justifyContent: "center"
    }}
  >
    <Carousel.Controls />
  </div>
</Carousel>;
```

### Controlled

```jsx
import { getPageFromAbsoluteIndex } from "../carousel";
import SlideControls from "../slide-controls";

const [index, setIndex] = React.useState(0);
const total = 3;

const Slide = ({ children, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
      height: "300px"
    }}
  >
    {children}
  </div>
);

// Since this is an infinite carousel, activePage could be negative or more than
// total. The carousel exports a method to get the right page from the absolute index.
const currentPage = getPageFromAbsoluteIndex(index, total);

<>
  <Carousel initialPage={index} onPageChange={setIndex}>
    <Carousel.Slide>
      <Slide color="#73c6b6">First slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#7389c6">Second slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#652ca3">Third slide</Slide>
    </Carousel.Slide>
  </Carousel>
  <SlideControls
    total={total}
    isFullSize
    onNextClick={() => setIndex((index) => index + 1)}
    onPrevClick={() => setIndex((index) => index - 1)}
    current={currentPage}
  />
</>;
```

### Autoplay

If you want the carousel to automatically slide to the next page, use the `hasAutoPlay`.
If `hasAutoPlay=true` you can an optional propertie: `autoPlayInterval (default: 3000)`.

If `pauseAutoPlayOnHover` is set to `true`, when the user interacts with the carousel, the `autoPlay` pauses until the user exits the carousel area.

```jsx
const Slide = ({ children, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
      height: "300px"
    }}
  >
    {children}
  </div>
);

<Carousel hasAutoPlay>
  <Carousel.Slide>
    <Slide color="#73c6b6">First slide</Slide>
  </Carousel.Slide>
  <Carousel.Slide>
    <Slide color="#7389c6">Second slide</Slide>
  </Carousel.Slide>
  <Carousel.Slide>
    <Slide color="#652ca3">Third slide</Slide>
  </Carousel.Slide>

  <Carousel.Controls isFullSize />
</Carousel>;
```

### Opacity animation

By default the carousel's pages get cut in the sliding animation. To have a opacity animation instead, use the `hasOpacityAnimation` property.

```jsx
const Slide = ({ children, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
      height: "300px"
    }}
  >
    {children}
  </div>
);

<div
  style={{
    overflow: "hidden",
    padding: "0 150px"
  }}
>
  <Carousel hasOpacityAnimation>
    <Carousel.Slide>
      <Slide color="#73c6b6">First slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#7389c6">Second slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#652ca3">Third slide</Slide>
    </Carousel.Slide>

    <Carousel.Controls isFullSize />
  </Carousel>
</div>;
```

### Arrow controls

You can use arrow controls instead of the slide controls by adding the `type="arrows"`.
Since the arrow controls display at the edge of the carousel, the carousel itself will become narrower.

The intended behaviour is to use partial opacity on the non-active slides, and with `scroll="finite"`.

When Arrow controls are in use, the swiping will be disabled for non-touch devices.

```jsx
const Slide = ({ children, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
      height: "300px"
    }}
  >
    {children}
  </div>
);
<div
  style={{
    overflow: "hidden"
  }}
>
  <Carousel
    slidesPerPage={{
      xs: 1,
      md: 2,
      lg: 4
    }}
    scroll="finite"
    hasGutter
  >
    <Carousel.Slide>
      <Slide color="#73c6b6">First slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#7389c6">Second slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#652ca3">Third slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#652fba">Fourth slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#659e0a">Fifth slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#5f93ff">Sixth slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#5e4eff">Seventh slide</Slide>
    </Carousel.Slide>
    <Carousel.Slide>
      <Slide color="#409fff">Eighth slide</Slide>
    </Carousel.Slide>

    <Carousel.Controls type="arrows" />
  </Carousel>
</div>;
```
