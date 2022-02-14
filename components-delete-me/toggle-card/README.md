A card component for selecting items from a collection, typically a [CardRadioGroup](http://localhost:6060/#/CardRadioGroup).

The entire card is tappable and includes a disabled state.

To see the selected state in action see CardRadioGroup or [CardInput](http://localhost:6060/#/CardInput).

## Variants

### Default

```jsx
import Grid from "@bmi-digital/components/grid";
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

<Grid container spacing={2}>
  <Grid item md={6} sm={12}>
    <ToggleCard
      title="Curabitur posuere varius erat"
      imageSource={demoFormattedImage}
    >
      <ToggleCard.Paragraph>P Card Lorem</ToggleCard.Paragraph>
    </ToggleCard>
  </Grid>
  <Grid item md={6} sm={12}>
    <ToggleCard title="Curabitur posuere varius erat" imageSource={demoImage}>
      <ToggleCard.Paragraph>P Card Lorem</ToggleCard.Paragraph>
    </ToggleCard>
  </Grid>
</Grid>;
```

### With Multiple Paragraphs

```jsx
import Grid from "@bmi-digital/components/grid";
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

<Grid container spacing={2}>
  <Grid item md={6} sm={12}>
    <ToggleCard
      title="Curabitur posuere varius erat"
      imageSource={demoFormattedImage}
    >
      <ToggleCard.Paragraph>
        Asfalt underlagsbelegg med selvklebende omlegg. Kategori: Bra
      </ToggleCard.Paragraph>
      <ToggleCard.Paragraph>
        Nobb: <strong>123456789</strong>
      </ToggleCard.Paragraph>
    </ToggleCard>
  </Grid>
  <Grid item md={6} sm={12}>
    <ToggleCard title="Curabitur posuere varius erat" imageSource={demoImage}>
      <ToggleCard.Paragraph>
        Asfalt underlagsbelegg med selvklebende omlegg. Kategori: Bra
      </ToggleCard.Paragraph>
      <ToggleCard.Paragraph>
        Nobb: <strong>123456789</strong>
      </ToggleCard.Paragraph>
    </ToggleCard>
  </Grid>
</Grid>;
```

### Tile example

```jsx
import Grid from "@bmi-digital/components/grid";
import demoFormattedImage from "./images/demo-product-format.jpg";
import demoImage from "./images/demo-product.jpg";
import demoRoofShape from "./images/demo-roof-shape.svg";

<>
  <Grid container spacing={2}>
    <Grid item sm={6} md={2}>
      <ToggleCard title="AereoDek Tradition" imageSource={demoFormattedImage}>
        <ToggleCard.Paragraph>6 colours</ToggleCard.Paragraph>
      </ToggleCard>
    </Grid>
  </Grid>
  <p>Disabled</p>
  <Grid container spacing={2}>
    <Grid item sm={6} md={2}>
      <ToggleCard
        disabled
        title="AereoDek Tradition"
        imageSource={demoFormattedImage}
      >
        <ToggleCard.Paragraph>6 colours</ToggleCard.Paragraph>
      </ToggleCard>
    </Grid>
  </Grid>
  <p>Title only</p>
  <Grid container spacing={2}>
    <Grid item sm={6} md={2}>
      <ToggleCard title="None" />
    </Grid>
  </Grid>

  <p>Illustration only</p>
  <Grid container spacing={2}>
    <Grid item xs={6} sm={6} md={2}>
      <ToggleCard illustratedImage={demoRoofShape} />
    </Grid>
  </Grid>
  <p>Image only</p>
  <Grid container spacing={2}>
    <Grid item xs={6} sm={6} md={2}>
      <ToggleCard imageSource={demoFormattedImage} />
    </Grid>
  </Grid>
  <p>
    Image only <em>again</em>
  </p>
  <Grid container spacing={2}>
    <Grid item xs={6} sm={6} md={2}>
      <ToggleCard imageSource={demoImage} />
    </Grid>
  </Grid>
</>;
```

### "Select roof shape" example

```jsx
import Grid from "@bmi-digital/components/grid";
import demoRoofShape from "./images/demo-roof-shape.svg";

<Grid container spacing={2}>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 1" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 2" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 3" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 4" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 5" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
  <Grid item xs={6} sm={6} md={2}>
    <ToggleCard title="Shape 6" illustratedImage={demoRoofShape}></ToggleCard>
  </Grid>
</Grid>;
```
