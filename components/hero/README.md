## Variants

### Hero Level One

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";
import Typography from "@bmi/typography";
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

### Hero Level Two

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";

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
import Breadcrumbs from "@bmi/breadcrumbs";

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

```jsx
import InputGroup from "@bmi/input-group";
import Button from "@bmi/button";
import TextField from "@bmi/text-field";
import SearchIcon from "@material-ui/icons/Search";
import firstImageSource from "./images/demo-tiles.jpg";
import secondImageSource from "./images/demo-tiles-black.png";
import thirdImageSource from "./images/demo-house.png";
<Hero
  level={0}
  heroes={[
    {
      title: "H1 First heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
      imageSource: firstImageSource,
      CTA: {
        label: "Call to Action Button"
      }
    },
    {
      title: "H1 Second heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
      imageSource: secondImageSource,
      CTA: {
        label: "Call to Action Button"
      }
    },
    {
      title: "H1 Third heading dark background",
      children:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
      imageSource: thirdImageSource,
      CTA: {
        label: "Call to Action Button"
      }
    }
  ]}
>
  <InputGroup
    lockBreakpoint="xs"
    input={<TextField name="search" label="Search" variant="hybrid" />}
    button={
      <Button accessibilityLabel="Search" isIconButton>
        <SearchIcon />
      </Button>
    }
  />
</Hero>;
```
