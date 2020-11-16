This is a variant of the hero with a full-width background image and a gradient overlay. The default background color is blue, other options are cyan, teal and charcoal.

## Colors

```jsx
import Breadcrumbs from "@bmi/breadcrumbs";
import Typography from "@bmi/typography";
import imageSource from "./images/demo-house.png";

const breadcrumbNode = (
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Products
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Roof
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Tiles
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
);
<>
  <p>Blue</p>

  <SpotlightHero
    breadcrumbs={breadcrumbNode}
    title="H1 Heading desktop"
    imageSource={imageSource}
  >
    <Typography>
      Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
      ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation
      ullamco ipsum duis reprehenderit labore officia incididunt amet aliquip
      quis.
    </Typography>
  </SpotlightHero>

  <p>Cyan</p>

  <SpotlightHero
    breadcrumbs={breadcrumbNode}
    title="H1 Heading desktop"
    imageSource={imageSource}
    backgroundColor="cyan"
  >
    <Typography>
      Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
      ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation
      ullamco ipsum duis reprehenderit labore officia incididunt amet aliquip
      quis.
    </Typography>
  </SpotlightHero>

  <p>Teal</p>

  <SpotlightHero
    breadcrumbs={breadcrumbNode}
    title="H1 Heading desktop"
    imageSource={imageSource}
    backgroundColor="teal"
  >
    <Typography>
      Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
      ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation
      ullamco ipsum duis reprehenderit labore officia incididunt amet aliquip
      quis.
    </Typography>
  </SpotlightHero>

  <p>Charcoal without breadcrumbs</p>

  <SpotlightHero
    title="H1 Heading desktop"
    imageSource={imageSource}
    backgroundColor="charcoal"
  >
    <Typography>
      Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
      ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation
      ullamco ipsum duis reprehenderit labore officia incididunt amet aliquip
      quis.
    </Typography>
  </SpotlightHero>
</>;
```
