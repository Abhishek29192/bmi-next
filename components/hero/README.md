[description]

## Variants

### [Title]

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";
import Typography from "@bmi/typography";

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
  imageSource="https://images.unsplash.com/photo-1528223871781-8f4c984f6164?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
>
  <Typography variant="h1">Concrete Tiles</Typography>
  <div
    style={{
      width: "50px",
      height: "2px",
      background: "#009FE3",
      margin: "20px 0 26px 0"
    }}
  />
  <Typography>
    Excepturi sint occaecati cupiditate non provident, similique sunt in culpa
    qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et
    harum
  </Typography>
</Hero>;
```
