This is a variant of the hero with a full-width background image and a gradient overlay. The default background color is blue, other options are cyan, teal and charcoal.

## Colors

```jsx
import Breadcrumbs from "../breadcrumbs";
import Typography from "../typography";
import imageSource from "./__tests__/images/demo-house.png";

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
    media={<img src={imageSource} alt="Lorem ipsum" />}
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
    media={<img src={imageSource} alt="Lorem ipsum" />}
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
    media={<img src={imageSource} alt="Lorem ipsum" />}
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
    media={<img src={imageSource} alt="Lorem ipsum" />}
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

### With Video

```jsx
import YoutubeVideo from "../youtube-video";
import Typography from "../typography";

<SpotlightHero
  title="H1 Heading desktop"
  media={
    <YoutubeVideo
      videoUrl="https://youtu.be/A-RfHC91Ewc"
      previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
      embedWidth={1280}
      embedHeight={720}
    />
  }
  backgroundColor="cyan"
>
  <Typography>
    Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
    ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation ullamco
    ipsum duis reprehenderit labore officia incididunt amet aliquip quis.
  </Typography>
</SpotlightHero>;
```

## Deprecated `imageSource`

This is going to be deprecated in `0.2.0`. Please use one of the examples above instead.

```jsx
import Breadcrumbs from "../breadcrumbs";
import Typography from "../typography";
import imageSource from "./__tests__/images/demo-house.png";

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

<SpotlightHero
  breadcrumbs={breadcrumbNode}
  title="H1 Heading desktop"
  imageSource={imageSource}
>
  <Typography>
    Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu quis
    ex nostrud sunt ad eu laboris commodo deserunt commodo. Exercitation ullamco
    ipsum duis reprehenderit labore officia incididunt amet aliquip quis.
  </Typography>
</SpotlightHero>;
```
