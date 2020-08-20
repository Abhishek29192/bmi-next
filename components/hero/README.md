## Variants

### Hero Level One

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";
import Typography from "@bmi/typography";
import imageSource from "./images/demo-tiles.jpg";

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

<Hero
  breadcrumbs={breadcrumbNode}
  imageSource={imageSource}
  title="Concrete Tiles"
>
  <Typography>
    Excepturi sint occaecati cupiditate non provident, similique sunt in culpa
    qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et
    harum
  </Typography>
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

<Hero breadcrumbs={breadcrumbNode} title="Concrete Tiles" isSlim />;
```

### Hero Level Three

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";

const breadcrumbNode = (
  <Breadcrumbs isLightThemed>
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

<Hero
  breadcrumbs={breadcrumbNode}
  title="Concrete Tiles"
  isLightThemed
  isSlim
/>;
```
