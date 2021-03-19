The Villain is a simple module which is split into two sections - one section is copy (text) and the other is an image. **And it is not a hero**.

There are 2 varieties of the Villain - Full Width and Grid Width. Each of these comes in 3 sizes - Small, Medium and Large, which refer to the height of the module.

## Variants

### Contained

```jsx
import Section from "@bmi/section";
import YoutubeVideo from "@bmi/youtube-video";
import greyTiles from "./images/grey-tiles.png";
import greyRoofHouseImage from "./images/grey-roof-house.png";

<Section>
  <Section.Title>H2 Heading</Section.Title>
  <Villain
    title="H4 Heading"
    imageSource={greyTiles}
    cta={{ label: "Call to action" }}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
    blandit, finibus augue et, ultricies felis.
  </Villain>
  <Villain
    title="H4 Heading"
    imageSource={greyRoofHouseImage}
    cta={{ label: "Call to action" }}
    isReversed
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
    blandit, finibus augue et, ultricies felis.
  </Villain>

  <Villain
    title="With video"
    imageSource={
      <YoutubeVideo videoId="A-RfHC91Ewc" embedWidth={1280} embedHeight={720} />
    }
    cta={{ label: "Call to action" }}
    isReversed
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
    blandit, finibus augue et, ultricies felis.
  </Villain>
</Section>;
```

### Full width

The villain could look very similar to the Hero, with the `isFullWidth` property on.
_Full width Villain components can be used as sections of a page (and therefore should not be nested within a Section component)._

```jsx
import greyRoofHouseImage from "./images/grey-roof-house.png";

<Villain
  title="H2 Heading"
  imageSource={greyRoofHouseImage}
  cta={{ label: "Call to action" }}
  isFullWidth
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl blandit,
  finibus augue et, ultricies felis. In id nunc nunc. Nullam ac nulla justo. Sed
  sollicitudin volutpat arcu at laoreet. Ut vel augue nisi. Pellentesque egestas
  sapien et mauris rutrum laoreet. Integer tellus enim, posuere vel nibh
  suscipit, rhoncus ornare lectus. Mauris ac interdum nibh, quis dictum nulla.
</Villain>;
```

#### With Video

```jsx
import YoutubeVideo from "@bmi/youtube-video";

<Villain
  title="H2 Heading"
  imageSource={
    <YoutubeVideo videoId="A-RfHC91Ewc" embedWidth={1280} embedHeight={720} />
  }
  cta={{ label: "Call to action" }}
  isFullWidth
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl blandit,
  finibus augue et, ultricies felis. In id nunc nunc. Nullam ac nulla justo. Sed
  sollicitudin volutpat arcu at laoreet. Ut vel augue nisi. Pellentesque egestas
  sapien et mauris rutrum laoreet. Integer tellus enim, posuere vel nibh
  suscipit, rhoncus ornare lectus. Mauris ac interdum nibh, quis dictum nulla.
</Villain>;
```

#### Reversed

```jsx
import greyRoofHouseImage from "./images/grey-roof-house.png";

<Villain
  title="H2 Heading"
  imageSource={greyRoofHouseImage}
  cta={{ label: "Call to action" }}
  isFullWidth
  isReversed
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl blandit,
  finibus augue et, ultricies felis. In id nunc nunc. Nullam ac nulla justo. Sed
  sollicitudin volutpat arcu at laoreet. Ut vel augue nisi. Pellentesque egestas
  sapien et mauris rutrum laoreet. Integer tellus enim, posuere vel nibh
  suscipit, rhoncus ornare lectus. Mauris ac interdum nibh, quis dictum nulla.
</Villain>;
```

### With `ColorPair`

The Villain uses the `ColorPair` component and its functionality. Pass a different `theme` to edit its default.

```jsx
import greyTiles from "./images/grey-tiles.png";
import greyRoofHouseImage from "./images/grey-roof-house.png";

<Villain title="H4 Heading" imageSource={greyTiles} theme="teal-400">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl blandit,
  finibus augue et, ultricies felis.
</Villain>;
```
