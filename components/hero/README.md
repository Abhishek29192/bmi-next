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
