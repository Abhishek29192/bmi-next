## Variants

### Hero Level One

```jsx
import Breadcrumbs from "@bmi-digital/components/breadcrumbs";
import Typography from "@bmi-digital/components/typography";
import imageSource from "./images/demo-tiles.jpg";

const media = <img src={imageSource} alt="Just some tiles" />;

const breadcrumbNode = (
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item linkComponent="a" href="/">
      Home
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Level 1 Page Name</Breadcrumbs.Item>
  </Breadcrumbs>
);

<Hero
  breadcrumbs={breadcrumbNode}
  media={media}
  title="H1 Heading desktop dark BG"
  level={1}
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt
  quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor
  nisl, nec vestibulum odio molestie tincidunt.
</Hero>;
```

### Hero Level Two

```jsx
import Breadcrumbs from "@bmi-digital/components/breadcrumbs";

const breadcrumbNode = (
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item linkComponent="a" href="/products">
      Products
    </Breadcrumbs.Item>
    <Breadcrumbs.Item linkComponent="a" href="/tiles">
      Roof
    </Breadcrumbs.Item>
    <Breadcrumbs.Item linkComponent="a" href="/tiles">
      Tiles
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
);

<Hero breadcrumbs={breadcrumbNode} title="Concrete Tiles" level={2} />;
```

### Hero Level Three

```jsx
import Breadcrumbs from "@bmi-digital/components/breadcrumbs";

const breadcrumbNode = (
  <Breadcrumbs>
    <Breadcrumbs.Item linkComponent="a" href="/products">
      Products
    </Breadcrumbs.Item>
    <Breadcrumbs.Item linkComponent="a" href="/tiles">
      Roof
    </Breadcrumbs.Item>
    <Breadcrumbs.Item linkComponent="a" href="/tiles">
      Tiles
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
);

<Hero breadcrumbs={breadcrumbNode} title="Concrete Tiles" level={3} />;
```

### Hero With Carousel

This is the most complex variation of the Hero, and it handles slightly different props: it accepts a `heroes` property with an Array of all props handled by simple heroes. See the type & props at the beginning of this page for more clarity.

When `autoPlayInterval` is specified, then the carousel will receive an `hasAutoPlay`

```jsx
import Button from "@bmi-digital/components/button";
import Search from "@bmi-digital/components/search";
import firstImageSource from "./images/demo-tiles.jpg";
import secondImageSource from "./images/demo-tiles-black.png";
import thirdImageSource from "./images/demo-house.png";

<Hero
  level={0}
  autoPlayInterval={10000}
  heroes={[
    {
      title: "H1 First heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
      media: <img src={firstImageSource} alt="first image source" />,
      CTA: <Button>Call to Action Button</Button>
    },
    {
      title: "H1 Second heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
      media: <img src={secondImageSource} alt="second image source" />,
      CTA: <Button>Call to Action Button</Button>
    },
    {
      title: "H1 Third heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
      media: <img src={thirdImageSource} alt="third image source" />,
      CTA: <Button>Call to Action Button</Button>
    }
  ]}
>
  <Search />
</Hero>;
```

### With Video

```jsx
import YoutubeVideo from "@bmi-digital/components/youtube-video";

<Hero
  media={
    <YoutubeVideo videoId="A-RfHC91Ewc" embedWidth={1280} embedHeight={720} />
  }
  title="H1 Heading desktop dark BG"
  level={1}
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt
  quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor
  nisl, nec vestibulum odio molestie tincidunt.
</Hero>;
```

### With Deprecated `imageSource`

The property `imageSource` got deprecated, the correct implementation, as shown in the previous examples, is to use a React Node instead.

However, this component still handles this property.

```jsx
import Breadcrumbs from "@bmi-digital/components/breadcrumbs";
import Typography from "@bmi-digital/components/typography";
import imageSource from "./images/demo-tiles.jpg";

const breadcrumbNode = (
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item linkComponent="a" href="/">
      Home
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Level 1 Page Name</Breadcrumbs.Item>
  </Breadcrumbs>
);

<Hero
  breadcrumbs={breadcrumbNode}
  imageSource={imageSource}
  title="H1 Heading desktop dark BG"
  level={1}
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt
  quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor
  nisl, nec vestibulum odio molestie tincidunt.
</Hero>;
```
